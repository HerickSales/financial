namespace Data.Dtos;

public class ReadUserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }

    public List<ReadTransactionDto> Transactions { get; set; }
}
