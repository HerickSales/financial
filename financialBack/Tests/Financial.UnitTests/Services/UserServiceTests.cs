using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Repository;
using FluentAssertions;
using Moq;
using Service;
using System.Linq.Expressions;
using Xunit;

namespace Financial.UnitTests.Services;

public class UserServiceTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mapperMock = new Mock<IMapper>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _userRepositoryMock = new Mock<IRepository<User>>();

        _unitOfWorkMock.Setup(u => u.UserRepository).Returns(_userRepositoryMock.Object);

        _userService = new UserService(_mapperMock.Object, _unitOfWorkMock.Object);
    }

    #region CreateUser Tests

    [Fact]
    public async Task CreateUser_WithValidData_ShouldReturnSuccess()
    {
        // Arrange
        var createUserDto = new CreateUserDto { Name = "João Silva", Age = 25 };
        var user = new User { Id = 1, Name = "João Silva", Age = 25 };

        _mapperMock.Setup(m => m.Map<User>(createUserDto)).Returns(user);
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(Task.CompletedTask);

        // Act
        var result = await _userService.CreateUser(createUserDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Add(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task CreateUser_WithInvalidName_ShouldReturnFailure()
    {
        // Arrange
        var createUserDto = new CreateUserDto { Name = "", Age = 25 };
        var user = new User { Id = 1, Name = "", Age = 25 };

        _mapperMock.Setup(m => m.Map<User>(createUserDto)).Returns(user);

        // Act
        var result = await _userService.CreateUser(createUserDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Add(It.IsAny<User>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Never);
    }

    [Fact]
    public async Task CreateUser_WithInvalidAge_ShouldReturnFailure()
    {
        // Arrange
        var createUserDto = new CreateUserDto { Name = "João Silva", Age = 200 };
        var user = new User { Id = 1, Name = "João Silva", Age = 200 };

        _mapperMock.Setup(m => m.Map<User>(createUserDto)).Returns(user);

        // Act
        var result = await _userService.CreateUser(createUserDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Add(It.IsAny<User>()), Times.Never);
    }

    #endregion

    #region GetUserById Tests

    [Fact]
    public async Task GetUserById_WithExistingUser_ShouldReturnUser()
    {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Name = "João Silva", Age = 25 };
        var readUserDto = new ReadUserDto { Id = userId, Name = "João Silva", Age = 25 };

        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync(user);
        _mapperMock.Setup(m => m.Map<ReadUserDto>(user)).Returns(readUserDto);

        // Act
        var result = await _userService.GetUserById(userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.FindById(userId), Times.Once);
    }

    [Fact]
    public async Task GetUserById_WithNonExistingUser_ShouldReturnNotFound()
    {
        // Arrange
        var userId = 999;
        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync((User?)null);

        // Act
        var result = await _userService.GetUserById(userId);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.FindById(userId), Times.Once);
    }

    #endregion

    #region GetAllUsers Tests

    [Fact]
    public async Task GetAllUsers_ShouldReturnListOfUsers()
    {
        // Arrange
        var users = new List<User>
        {
            new User { Id = 1, Name = "João Silva", Age = 25 },
            new User { Id = 2, Name = "Maria Santos", Age = 30 }
        };
        var userDtos = new List<ReadUserDto>
        {
            new ReadUserDto { Id = 1, Name = "João Silva", Age = 25 },
            new ReadUserDto { Id = 2, Name = "Maria Santos", Age = 30 }
        };

        _userRepositoryMock
            .Setup(r => r.FindWhere(It.IsAny<Expression<Func<User, bool>>>(), 1, 10))
            .ReturnsAsync(users);
        _mapperMock.Setup(m => m.Map<List<ReadUserDto>>(users)).Returns(userDtos);

        // Act
        var result = await _userService.GetAllUsers(1, 10, "", -1, -1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.FindWhere(It.IsAny<Expression<Func<User, bool>>>(), 1, 10), Times.Once);
    }

    #endregion

    #region DeleteUser Tests

    [Fact]
    public async Task DeleteUser_WithExistingUser_ShouldReturnSuccess()
    {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Name = "João Silva", Age = 25 };

        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync(user);
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(Task.CompletedTask);

        // Act
        var result = await _userService.DeleteUser(userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Delete(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task DeleteUser_WithNonExistingUser_ShouldReturnNotFound()
    {
        // Arrange
        var userId = 999;
        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync((User?)null);

        // Act
        var result = await _userService.DeleteUser(userId);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Delete(It.IsAny<User>()), Times.Never);
    }

    #endregion

    #region UpdateUser Tests

    [Fact]
    public async Task UpdateUser_WithValidData_ShouldReturnSuccess()
    {
        // Arrange
        var userId = 1;
        var updateUserDto = new UpdateUserDto { Name = "João Silva Atualizado", Age = 26 };
        var user = new User { Id = userId, Name = "João Silva", Age = 25 };

        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync(user);
        _mapperMock.Setup(m => m.Map(updateUserDto, user)).Callback(() =>
        {
            user.Name = updateUserDto.Name;
            user.Age = updateUserDto.Age;
        });
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(Task.CompletedTask);

        // Act
        var result = await _userService.UpdateUser(userId, updateUserDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Update(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.Commit(), Times.Once);
    }

    [Fact]
    public async Task UpdateUser_WithNonExistingUser_ShouldReturnNotFound()
    {
        // Arrange
        var userId = 999;
        var updateUserDto = new UpdateUserDto { Name = "João Silva", Age = 26 };

        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync((User?)null);

        // Act
        var result = await _userService.UpdateUser(userId, updateUserDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Update(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task UpdateUser_WithInvalidAge_ShouldReturnFailure()
    {
        // Arrange
        var userId = 1;
        var updateUserDto = new UpdateUserDto { Name = "João Silva", Age = -5 };
        var user = new User { Id = userId, Name = "João Silva", Age = 25 };

        _userRepositoryMock.Setup(r => r.FindById(userId)).ReturnsAsync(user);
        _mapperMock.Setup(m => m.Map(updateUserDto, user)).Callback(() =>
        {
            user.Age = updateUserDto.Age;
        });

        // Act
        var result = await _userService.UpdateUser(userId, updateUserDto);

        // Assert
        result.IsFailed.Should().BeTrue();
        _userRepositoryMock.Verify(r => r.Update(It.IsAny<User>()), Times.Never);
    }

    #endregion
}
