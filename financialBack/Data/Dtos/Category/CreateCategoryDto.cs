using Domain.Enums;

namespace Data.Dtos;

public class CreateCategoryDto
{
    public string Description { get; set; }
    public string Finality { get; set; }
}
