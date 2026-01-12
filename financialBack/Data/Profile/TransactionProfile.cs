using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Enums;

namespace Data.Profiles;

public class TransactionProfile: Profile
{
    public TransactionProfile()
    {
        CreateMap<CreateTransactionDto, Transaction>().ForMember(
            dest => dest.Type,
            opt => opt.MapFrom(src => MapTransactionType(src.Type))
        );
        CreateMap<UpdateTransactionDto, Transaction>().ForMember(
            dest => dest.Type,
            opt => opt.MapFrom(src => MapTransactionType(src.Type))
        );
        CreateMap<Transaction, ReadTransactionDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => MapTransactionType(src.Type)))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.CreatedAt.ToString("dd/MM/yyyy")))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => new ReadCategorySimpleDto
            {
                Id = src.Category.Id,
                Description = src.Category.Description,
                Finality = src.Category.Finality.ToString().ToLower()
            }))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => new ReadUserSimpleDto
            {
                Id = src.User.Id,
                Name = src.User.Name,
                Age = src.User.Age
            }));
    }
    private string MapTransactionType(TransactionType transactionType)
    {
        return transactionType switch
        {
            TransactionType.Expense => "expense",
            TransactionType.Income => "income",
            _ => throw new ArgumentException("Invalid transaction type")
        };
    }
    private TransactionType MapTransactionType(string transactionType)
    {
        return transactionType.ToLower() switch
        {
            "expense" => TransactionType.Expense,
            "income" => TransactionType.Income,
            _ => throw new ArgumentException("Invalid transaction type")
        };
    }
}
