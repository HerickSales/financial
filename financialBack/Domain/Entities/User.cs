using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class User
{
    [Key]
    public int Id {get;set;}
    public string Name {get;set;}
    public int Age {get;set;}
    public virtual List<Transaction> Transactions { get; set; } = new();

}
