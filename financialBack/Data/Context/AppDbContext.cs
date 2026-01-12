using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace financial.Data.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da entidade User
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.Age)
                .IsRequired();
        });

        // Configuração da entidade Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Finality)
                .IsRequired()
                .HasConversion<int>();
        });

        // Configuração da entidade Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(300);
            entity.Property(e => e.Value)
                .IsRequired()
                .HasColumnType("REAL");
            entity.Property(e => e.Type)
                .IsRequired()
                .HasConversion<int>();

            // Relacionamentos
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
