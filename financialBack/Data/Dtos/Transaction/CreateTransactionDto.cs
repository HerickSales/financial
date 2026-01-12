using Domain.Enums;

namespace Data.Dtos;

public class CreateTransactionDto
{

    public string Description { get; set; }
    public decimal Value { get; set; }
    public string Type { get; set; }
    public int CategoryId { get; set; }
    public int UserId { get; set; }


}
