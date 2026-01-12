using Domain.Enums;

namespace Data.Dtos;

public class ReadTransactionDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public decimal Value { get; set; }
    public string Type { get; set; }
    public DateTime Date { get; set; }
    public ReadCategorySimpleDto Category { get; set; }
    public ReadUserSimpleDto User { get; set; }
}
