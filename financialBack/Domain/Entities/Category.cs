using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities;

public class Category
{
    [Key]
    public int Id { get; set;}
    public string Description { get; set;}
    public FinalityType Finality { get; set;}
    public virtual List<Transaction> Transactions { get; set; } = new();
}
