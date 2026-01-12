using Domain.Entities;

namespace Domain.Repository
{
    public interface IUnitOfWork
    {
        IRepository<User> UserRepository { get; }
        IRepository<Category> CategoryRepository { get; }
        IRepository<Transaction> TransactionRepository { get; }
        Task Commit();
    }
}
