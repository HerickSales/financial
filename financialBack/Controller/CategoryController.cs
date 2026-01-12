using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Service;
using Data.Dtos;

namespace Controller;

[Route("[controller]")]
public class CategoryController : BaseController
{
    CategoryService _categoryService;
    public CategoryController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllCategories(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int finality = -1)
    {
        var result = await _categoryService.GetAllCategories(pageNumber, pageSize, finality);
        return ToActionResult(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetCategoryById(int id)
    {
        var result = await _categoryService.GetCategoryById(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<ActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var result = await _categoryService.CreateCategory(dto);
        return ToActionResult(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await _categoryService.UpdateCategory(id, dto);
        return ToActionResult(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategory(id);
        return ToActionResult(result);
    }
}
