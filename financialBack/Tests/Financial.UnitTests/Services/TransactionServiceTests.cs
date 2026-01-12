using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Enums;
using Domain.Repository;
using FluentAssertions;
using Moq;
using Service;
using System.Linq.Expressions;
using Xunit;

namespace Financial.UnitTests.Services;

public class TransactionServiceTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IRepository<Transaction>> _transactionRepositoryMock;
    private readonly Mock<IRepository<Category>> _categoryRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly TransactionService _transactionService;

    public TransactionServiceTests()
    {
        _mapperMock = new Mock<IMapper>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _transactionRepositoryMock = new Mock<IRepository<Transaction>>();
        _categoryRepositoryMock = new Mock<IRepository<Category>>();
        _userRepositoryMock = new Mock<IRepository<User>>();

        _unitOfWorkMock.Setup(u => u.TransactionRepository).Returns(_transactionRepositoryMock.Object);
        _unitOfWorkMock.Setup(u => u.CategoryRepository).Returns(_categoryRepositoryMock.Object);
        _unitOfWorkMock.Setup(u => u.UserRepository).Returns(_userRepositoryMock.Object);

        _transactionService = new TransactionService(_mapperMock.Object, _unitOfWorkMock.Object);
    }

    #region CreateTransaction Tests

    [Fact]
    public async Task CreateTransaction_WithValidData_ShouldReturnSuccess()
    {
        // Arrange
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = "expense",
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var user = new User { Id = 1, Name = "João", Age = 25 };
        var transaction = new Transaction
        {
            Id = 1,
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(transaction), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task CreateTransaction_WithNonExistentCategory_ShouldReturnFailure()
    {
        // Arrange
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = "expense",
            CategoryId = 999,
            UserId = 1
        };
        var transaction = new Transaction
        {
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = TransactionType.Expense,
            CategoryId = 999,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(999)).ReturnsAsync((Category?)null);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateTransaction_WithNonExistentUser_ShouldReturnFailure()
    {
        // Arrange
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = "expense",
            CategoryId = 1,
            UserId = 999
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var transaction = new Transaction
        {
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 999
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(999)).ReturnsAsync((User?)null);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateTransaction_WithIncompatibleTypeAndCategory_ShouldReturnFailure()
    {
        // Arrange - Tentando criar Income em categoria Expense
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Salário",
            Value = 5000m,
            Type = "income",
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense }; // Categoria é Expense
        var user = new User { Id = 1, Name = "João", Age = 25 };
        var transaction = new Transaction
        {
            Description = "Salário",
            Value = 5000m,
            Type = TransactionType.Income, // Transação é Income
            CategoryId = 1,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateTransaction_WithMinorUserAndIncomeType_ShouldReturnFailure()
    {
        // Arrange - Menor de idade tentando criar transação de receita
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Salário",
            Value = 5000m,
            Type = "income",
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Salário", Finality = FinalityType.Income };
        var user = new User { Id = 1, Name = "João", Age = 16 }; // Menor de idade
        var transaction = new Transaction
        {
            Description = "Salário",
            Value = 5000m,
            Type = TransactionType.Income,
            CategoryId = 1,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateTransaction_WithNegativeValue_ShouldReturnFailure()
    {
        // Arrange
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "Compra",
            Value = -100m,
            Type = "expense",
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var user = new User { Id = 1, Name = "João", Age = 25 };
        var transaction = new Transaction
        {
            Description = "Compra",
            Value = -100m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateTransaction_WithEmptyDescription_ShouldReturnFailure()
    {
        // Arrange
        var createTransactionDto = new CreateTransactionDto
        {
            Description = "",
            Value = 100m,
            Type = "expense",
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var user = new User { Id = 1, Name = "João", Age = 25 };
        var transaction = new Transaction
        {
            Description = "",
            Value = 100m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 1
        };

        _mapperMock.Setup(m => m.Map<Transaction>(createTransactionDto)).Returns(transaction);
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.CreateTransaction(createTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Add(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    #endregion

    #region GetTransaction Tests

    [Fact]
    public async Task GetTransactionById_WhenTransactionExists_ShouldReturnSuccess()
    {
        // Arrange
        var transaction = new Transaction
        {
            Id = 1,
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 1
        };
        var transactionDto = new ReadTransactionDto
        {
            Id = 1,
            Description = "Compra supermercado",
            Value = 100.50m,
            Type = "expense"
        };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(transaction);
        _mapperMock.Setup(m => m.Map<ReadTransactionDto>(transaction)).Returns(transactionDto);

        // Act
        var result = await _transactionService.GetTransactionById(1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.FindById(1), Times.Once);
        _mapperMock.Verify(m => m.Map<ReadTransactionDto>(transaction), Times.Once);
    }

    [Fact]
    public async Task GetTransactionById_WhenTransactionDoesNotExist_ShouldReturnFailure()
    {
        // Arrange
        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Transaction?)null);

        // Act
        var result = await _transactionService.GetTransactionById(1);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.FindById(1), Times.Once);
    }

    [Fact]
    public async Task GetTransactions_WithFilters_ShouldReturnSuccess()
    {
        // Arrange
        var transactions = new List<Transaction>
        {
            new Transaction { Id = 1, Description = "Compra 1", Value = 100m, Type = TransactionType.Expense },
            new Transaction { Id = 2, Description = "Compra 2", Value = 200m, Type = TransactionType.Expense }
        };
        var transactionDtos = new List<ReadTransactionDto>
        {
            new ReadTransactionDto { Id = 1, Description = "Compra 1", Value = 100m, Type = "expense" },
            new ReadTransactionDto { Id = 2, Description = "Compra 2", Value = 200m, Type = "expense" }
        };

        _transactionRepositoryMock.Setup(r => r.FindWhere(It.IsAny<Expression<Func<Transaction, bool>>>(), 1, 10))
            .ReturnsAsync(transactions);
        _mapperMock.Setup(m => m.Map<List<ReadTransactionDto>>(transactions)).Returns(transactionDtos);

        // Act
        var result = await _transactionService.GetTransactions(1, 10, 1, 2024);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.FindWhere(It.IsAny<Expression<Func<Transaction, bool>>>(), 1, 10), Times.Once);
        _mapperMock.Verify(m => m.Map<List<ReadTransactionDto>>(transactions), Times.Once);
    }

    #endregion

    #region UpdateTransaction Tests

    [Fact]
    public async Task UpdateTransaction_WhenTransactionExists_ShouldReturnSuccess()
    {
        // Arrange
        var updateTransactionDto = new UpdateTransactionDto
        {
            Description = "Compra atualizada",
            Value = 150m,
            Type = "expense",
            CategoryId = 1,
            UserId = 1
        };
        var existingTransaction = new Transaction
        {
            Id = 1,
            Description = "Compra antiga",
            Value = 100m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 1
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var user = new User { Id = 1, Name = "João", Age = 25 };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingTransaction);
        _mapperMock.Setup(m => m.Map(updateTransactionDto, existingTransaction))
            .Callback<UpdateTransactionDto, Transaction>((dto, trans) =>
            {
                trans.Description = dto.Description;
                trans.Value = dto.Value;
                trans.Type = TransactionType.Expense;
            });
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(user);

        // Act
        var result = await _transactionService.UpdateTransaction(1, updateTransactionDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        existingTransaction.Description.Should().Be("Compra atualizada");
        existingTransaction.Value.Should().Be(150m);
        _transactionRepositoryMock.Verify(r => r.Update(existingTransaction), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task UpdateTransaction_WhenTransactionDoesNotExist_ShouldReturnFailure()
    {
        // Arrange
        var updateTransactionDto = new UpdateTransactionDto
        {
            Description = "Compra atualizada",
            Value = 150m,
            Type = "expense",
            CategoryId = 1,
            UserId = 1
        };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Transaction?)null);

        // Act
        var result = await _transactionService.UpdateTransaction(1, updateTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Update(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task UpdateTransaction_WithNonExistentCategory_ShouldReturnFailure()
    {
        // Arrange
        var updateTransactionDto = new UpdateTransactionDto
        {
            Description = "Compra atualizada",
            Value = 150m,
            Type = "expense",
            CategoryId = 999,
            UserId = 1
        };
        var existingTransaction = new Transaction
        {
            Id = 1,
            Description = "Compra antiga",
            Value = 100m,
            Type = TransactionType.Expense,
            CategoryId = 999,
            UserId = 1
        };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingTransaction);
        _mapperMock.Setup(m => m.Map(updateTransactionDto, existingTransaction));
        _categoryRepositoryMock.Setup(r => r.FindById(999)).ReturnsAsync((Category?)null);

        // Act
        var result = await _transactionService.UpdateTransaction(1, updateTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Update(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task UpdateTransaction_WithNonExistentUser_ShouldReturnFailure()
    {
        // Arrange
        var updateTransactionDto = new UpdateTransactionDto
        {
            Description = "Compra atualizada",
            Value = 150m,
            Type = "expense",
            CategoryId = 1,
            UserId = 999
        };
        var existingTransaction = new Transaction
        {
            Id = 1,
            Description = "Compra antiga",
            Value = 100m,
            Type = TransactionType.Expense,
            CategoryId = 1,
            UserId = 999
        };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingTransaction);
        _mapperMock.Setup(m => m.Map(updateTransactionDto, existingTransaction));
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _userRepositoryMock.Setup(r => r.FindById(999)).ReturnsAsync((User?)null);

        // Act
        var result = await _transactionService.UpdateTransaction(1, updateTransactionDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Update(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    #endregion

    #region DeleteTransaction Tests

    [Fact]
    public async Task DeleteTransaction_WhenTransactionExists_ShouldReturnSuccess()
    {
        // Arrange
        var existingTransaction = new Transaction
        {
            Id = 1,
            Description = "Compra",
            Value = 100m,
            Type = TransactionType.Expense
        };

        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingTransaction);

        // Act
        var result = await _transactionService.DeleteTransaction(1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Delete(existingTransaction), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task DeleteTransaction_WhenTransactionDoesNotExist_ShouldReturnFailure()
    {
        // Arrange
        _transactionRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Transaction?)null);

        // Act
        var result = await _transactionService.DeleteTransaction(1);

        // Assert
        result.IsFailed.Should().BeTrue();
        _transactionRepositoryMock.Verify(r => r.Delete(It.IsAny<Transaction>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    #endregion
}
