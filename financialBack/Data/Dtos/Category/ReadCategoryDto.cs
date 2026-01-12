using Domain.Enums;

namespace Data.Dtos;

public class ReadCategoryDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public string Finality { get; set; }
    public List<ReadTransactionDto> Transactions { get; set; }
}
