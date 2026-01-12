using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Repository;
using Domain.Validators;
using financial.Handlers;
using FluentResults;
using Microsoft.AspNetCore.SignalR;

namespace Service
{
    public class TransactionService
    {
        IMapper mapper;
        IUnitOfWork unit;

        TransactionValidator validator = new TransactionValidator();

        public TransactionService(IMapper mapper, IUnitOfWork unit)
        {
            this.mapper = mapper;
            this.unit = unit;
        }


        public async Task<Result> CreateTransaction(CreateTransactionDto dto)
        {
            var transaction = mapper.Map<Transaction>(dto);

            // Load category for validation
            var category = await unit.CategoryRepository.FindById(dto.CategoryId);
            if (category == null)
            {
                return HandleResponse.FailResponse("Categoria não encontrada", 404);
            }
            var user = await unit.UserRepository.FindById(dto.UserId);
            if (user == null)
            {
                return HandleResponse.FailResponse("Usuário não encontrado", 404);
            }

            transaction.Category = category;
            transaction.User = user;

            var validationResult = validator.Validate(transaction);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return HandleResponse.FailResponse("Falha na validação da transação", 400, errors);
            }
             unit.TransactionRepository.Add(transaction);
             await unit.Commit();
            return HandleResponse.SuccessResponse("Transação criada com sucesso", 201, new {id= transaction.Id});
        }
        
        public async Task<Result> GetTransactionById(int id)
        {
            var transaction = await unit.TransactionRepository.FindById(id);
            if (transaction == null)
            {
                return HandleResponse.FailResponse("Transação não encontrada", 404);
            }
            var transactionDto = mapper.Map<ReadTransactionDto>(transaction);
            return HandleResponse.SuccessResponse("Transação encontrada com sucesso", 200, transactionDto);
        }

        public async Task<Result> GetTransactions(int pageNumber, int pageSize, int month, int year)
        {
            System.Linq.Expressions.Expression<Func<Transaction, bool>> filter = t =>
                (month <= 0 || t.CreatedAt.Month == month) &&
                (year <= 0 || t.CreatedAt.Year == year);

            var transactions = await unit.TransactionRepository.FindWhere(filter, pageNumber, pageSize);
            var transactionDtos = mapper.Map<List<ReadTransactionDto>>(transactions);
            return HandleResponse.SuccessResponse("Transações encontradas com sucesso", 200, transactionDtos);
        }
        
        public async Task<Result> DeleteTransaction(int id)
        {
            var transaction = await unit.TransactionRepository.FindById(id);
            if (transaction == null)
            {
                return HandleResponse.FailResponse("Transação não encontrada", 404);
            }
            unit.TransactionRepository.Delete(transaction);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Transação deletada com sucesso", 204);
        }
        
        public async Task<Result> UpdateTransaction(int id, UpdateTransactionDto dto)
        {
            var transaction = await unit.TransactionRepository.FindById(id);
            if (transaction == null)
            {
                return HandleResponse.FailResponse("Transação não encontrada", 404);
            }
            mapper.Map(dto, transaction);

            // Load category for validation
            var category = await unit.CategoryRepository.FindById(transaction.CategoryId);
            if (category == null)
            {
                return HandleResponse.FailResponse("Categoria não encontrada", 404);
            }

            // Load user for validation
            var user = await unit.UserRepository.FindById(transaction.UserId);
            if (user == null)
            {
                return HandleResponse.FailResponse("Usuário não encontrado", 404);
            }

            transaction.Category = category;
            transaction.User = user;

            var validationResult = validator.Validate(transaction);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage).ToList();
                return HandleResponse.FailResponse("Falha na validação da transação", 400, errors);
            }

            unit.TransactionRepository.Update(transaction);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Transação atualizada com sucesso", 204);
        }
        

    }
}