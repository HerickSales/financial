using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Enums;

namespace Domain.Entities;

public class Transaction
{
    [Key]
    public int Id { get; set; }
    public string Description { get; set; }
    public decimal Value { get; set; }
    public TransactionType Type { get; set; }
    [ForeignKey("Category")]
    public int CategoryId { get; set; }
    [ForeignKey("User")]
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public virtual Category Category { get; set; }
    public virtual User User { get; set; }


}
