using System.Linq.Expressions;
using financial.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Domain.Repository
{
    public class Repository<T> : IRepository<T>
        where T : class
    {
        public readonly AppDbContext context;

        public Repository(AppDbContext context)
        {
            this.context = context;
        }

        public IQueryable<T> AsQueryable() => context.Set<T>();

        public async Task<List<T>> FindAll(int pageNumber, int pageSize)
        {
            return await context
                .Set<T>()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<T?> FindById(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> FindWhere(
            Expression<Func<T, bool>> predicate,
            int pageNumber,
            int pageSize
        )
        {
            return await  context
                .Set<T>()
                .Where(predicate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public void Add(T entity)
        {
            context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            context.Remove(entity);
        }

        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public async Task<T?> FirstOrDefaultAsync()
        {
            return await context.Set<T>().FirstOrDefaultAsync();
        }
    }
}
