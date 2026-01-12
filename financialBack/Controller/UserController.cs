using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Service;
using Data.Dtos;

namespace Controller;

[Route("[controller]")]
public class UserController : BaseController
{
    UserService _userService;
    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string name = "",
        [FromQuery] int maxAge = -1,
        [FromQuery] int minAge = -1)
    {
        var result = await _userService.GetAllUsers(pageNumber, pageSize, name, maxAge, minAge);
        return ToActionResult(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetUserById(int id)
    {
        var result = await _userService.GetUserById(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<ActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var result = await _userService.CreateUser(dto);
        return ToActionResult(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        var result = await _userService.UpdateUser(id, dto);
        return ToActionResult(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var result = await _userService.DeleteUser(id);
        return ToActionResult(result);
    }
}
