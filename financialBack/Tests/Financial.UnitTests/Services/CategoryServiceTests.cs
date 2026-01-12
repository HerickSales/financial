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

public class CategoryServiceTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IRepository<Category>> _categoryRepositoryMock;
    private readonly CategoryService _categoryService;

    public CategoryServiceTests()
    {
        _mapperMock = new Mock<IMapper>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _categoryRepositoryMock = new Mock<IRepository<Category>>();

        _unitOfWorkMock.Setup(u => u.CategoryRepository).Returns(_categoryRepositoryMock.Object);

        _categoryService = new CategoryService(_mapperMock.Object, _unitOfWorkMock.Object);
    }
    #region CreateCategory Tests

    [Fact]
    public async Task CreateCategory_WithExpenseFinality_ShouldReturnSuccess()
    {
        // Arrange
        var createCategoryDto = new CreateCategoryDto { Description = "Alimentação", Finality = "expense" };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        _mapperMock.Setup(m => m.Map<Category>(createCategoryDto)).Returns(category);

        //Act
        var result = await _categoryService.CreateCategory(createCategoryDto);

        //Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Add(category), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);

    }
    [Fact]
    public async Task CreateCategory_WithIncomeFinality_ShouldReturnSuccess()
    {
        // Arrange
        var createCategoryDto = new CreateCategoryDto { Description = "Alimentação", Finality = "income" };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Income };
        _mapperMock.Setup(m => m.Map<Category>(createCategoryDto)).Returns(category);

        //Act
        var result = await _categoryService.CreateCategory(createCategoryDto);

        //Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Add(category), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);

    }
    [Fact]
    public async Task CreateCategory_WithBothFinality_ShouldReturnSuccess()
    {
        // Arrange
        var createCategoryDto = new CreateCategoryDto { Description = "Alimentação", Finality = "both" };
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Both };
        _mapperMock.Setup(m => m.Map<Category>(createCategoryDto)).Returns(category);

        //Act
        var result = await _categoryService.CreateCategory(createCategoryDto);

        //Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Add(category), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);

    }
    [Fact]
    public async Task CreateCategory_WithInvalidFinality_ShouldThrowException()
    {
        // Arrange
        var createCategoryDto = new CreateCategoryDto { Description = "Alimentação", Finality = "invalid" };
        _mapperMock.Setup(m => m.Map<Category>(createCategoryDto))
            .Throws(new ArgumentException("Invalid finality type"));

        //Act
        Func<Task> act = async () => await _categoryService.CreateCategory(createCategoryDto);

        //Assert
        await act.Should().ThrowAsync<ArgumentException>().WithMessage("Invalid finality type");
        _categoryRepositoryMock.Verify(r => r.Add(It.IsAny<Category>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateCategory_WithEmptyDescription_ShouldReturnFailure()
    {
        // Arrange
        var createCategoryDto = new CreateCategoryDto { Description = "", Finality = "expense" };
        var category = new Category { Id = 0, Description = "", Finality = FinalityType.Expense };
        _mapperMock.Setup(m => m.Map<Category>(createCategoryDto)).Returns(category);

        //Act
        var result = await _categoryService.CreateCategory(createCategoryDto);

        //Assert
        result.IsFailed.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Add(It.IsAny<Category>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }
    #endregion

    #region GetCategories Tests
    [Fact]
    public async Task GetAllCategories_ShouldReturnSuccess()
    {
        //Arrange
        var categories = new List<Category>
        {
            new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense },
            new Category { Id = 2, Description = "Salário", Finality = FinalityType.Income }
        };
        var categoryDtos = new List<ReadCategoryDto>
        {
            new ReadCategoryDto { Id = 1, Description = "Alimentação", Finality = "expense" },
            new ReadCategoryDto { Id = 2, Description = "Salário", Finality = "income" }
        };
        _categoryRepositoryMock.Setup(r => r.FindWhere(It.IsAny<Expression<Func<Category, bool>>>(), 1, 10))
            .ReturnsAsync(categories);
        _mapperMock.Setup(m => m.Map<List<ReadCategoryDto>>(categories)).Returns(categoryDtos);

        //Act
        var result = await _categoryService.GetAllCategories(1, 10, -1);

        //Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.FindWhere(It.IsAny<Expression<Func<Category, bool>>>(), 1, 10), Times.Once);
        _mapperMock.Verify(m => m.Map<List<ReadCategoryDto>>(categories), Times.Once);
    }

    [Fact]
    public async Task GetCategoryById_WhenCategoryExists_ShouldReturnSuccess()
    {
        //Arrange
        var category = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        var categoryDto = new ReadCategoryDto { Id = 1, Description = "Alimentação", Finality = "expense" };
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(category);
        _mapperMock.Setup(m => m.Map<ReadCategoryDto>(category)).Returns(categoryDto);

        //Act
        var result = await _categoryService.GetCategoryById(1);

        //Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.FindById(1), Times.Once);
        _mapperMock.Verify(m => m.Map<ReadCategoryDto>(category), Times.Once);
    }

    [Fact]
    public async Task GetCategoryById_WhenCategoryDoesNotExist_ShouldReturnFailure()
    {
        //Arrange
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Category?)null);

        //Act
        var result = await _categoryService.GetCategoryById(1);

        //Assert
        result.IsFailed.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.FindById(1), Times.Once);
    }

    #endregion

    #region UpdateCategory Tests
    [Fact]
    public async Task UpdateCategory_WhenCategoryExists_ShouldReturnSuccess()
    {
        // Arrange
        var updateCategoryDto = new UpdateCategoryDto {  Description = "Alimentação Atualizada", Finality = "expense" };
        var existingCategory = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingCategory);
        _mapperMock.Setup(m => m.Map(updateCategoryDto, existingCategory))
            .Callback<UpdateCategoryDto, Category>((dto, cat) =>
            {
                cat.Description = dto.Description;
                cat.Finality = FinalityType.Expense;
            });

        // Act
        var result = await _categoryService.UpdateCategory(1, updateCategoryDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        existingCategory.Description.Should().Be("Alimentação Atualizada");
        existingCategory.Finality.Should().Be(FinalityType.Expense);
        _categoryRepositoryMock.Verify(r => r.Update(existingCategory), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task UpdateCategory_WhenCategoryDoesNotExist_ShouldReturnFailure()
    {
        // Arrange
        var updateCategoryDto = new UpdateCategoryDto { Description = "Alimentação Atualizada", Finality = "expense" };
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Category?)null);

        // Act
        var result = await _categoryService.UpdateCategory(1, updateCategoryDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Update(It.IsAny<Category>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task UpdateCategory_WithInvalidFinality_ShouldThrowException()
    {
        // Arrange
        var updateCategoryDto = new UpdateCategoryDto { Description = "Alimentação Atualizada", Finality = "invalid" };
        var existingCategory = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingCategory);
        _mapperMock.Setup(m => m.Map(updateCategoryDto, existingCategory))
            .Throws(new ArgumentException("Invalid finality type"));

        // Act
        Func<Task> act = async () => await _categoryService.UpdateCategory(1, updateCategoryDto);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>().WithMessage("Invalid finality type");
        _categoryRepositoryMock.Verify(r => r.Update(It.IsAny<Category>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }
    #endregion

    #region DeleteCategory Tests
    [Fact]
    public async Task DeleteCategory_WhenCategoryExists_ShouldReturnSuccess()
    {
        // Arrange
        var existingCategory = new Category { Id = 1, Description = "Alimentação", Finality = FinalityType.Expense };
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync(existingCategory);

        // Act
        var result = await _categoryService.DeleteCategory(1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Delete(existingCategory), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task DeleteCategory_WhenCategoryDoesNotExist_ShouldReturnFailure()
    {
        // Arrange
        _categoryRepositoryMock.Setup(r => r.FindById(1)).ReturnsAsync((Category?)null);

        // Act
        var result = await _categoryService.DeleteCategory(1);

        // Assert
        result.IsFailed.Should().BeTrue();
        _categoryRepositoryMock.Verify(r => r.Delete(It.IsAny<Category>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }
    #endregion

}