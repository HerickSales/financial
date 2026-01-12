using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query;

namespace Domain.Repository
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> AsQueryable();

        Task<List<T>> FindAll(int pageNumber, int pageSize);

        Task<T?> FindById(int id);



        Task<List<T>> FindWhere(
            Expression<Func<T, bool>> predicate,
            int pageNumber,
            int pageSize
        );

 
        void Add(T entity);

        void Update(T entity);
 
        void Delete(T entity);

        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync();

  
    }
}