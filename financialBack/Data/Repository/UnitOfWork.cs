using Domain.Entities;
using Domain.Repository;
using financial.Data.Context;

namespace Data.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IRepository<User> UserRepository { get; }
        public IRepository<Category> CategoryRepository { get; }
        public IRepository<Transaction> TransactionRepository { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            UserRepository = new Repository<User>(context);
            CategoryRepository = new Repository<Category>(context);
            TransactionRepository = new Repository<Transaction>(context);
        }

        public async Task Commit()
        {
            await _context.SaveChangesAsync();
        }


    }
}
