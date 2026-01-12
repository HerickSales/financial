using FluentValidation;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Validators;

public class TransactionValidator : AbstractValidator<Transaction>
{
    public TransactionValidator()
    {
        RuleFor(transaction => transaction.Description)
            .NotEmpty().WithMessage("Campo Descrição é obrigatório.")
            .MinimumLength(2).WithMessage("A Descrição deve ter no mínimo 2 caracteres.")
            .MaximumLength(300).WithMessage("A Descrição deve ter no máximo 300 caracteres.");

        RuleFor(transaction => transaction.Value)
            .GreaterThan(0).WithMessage("O Valor deve ser maior que zero.");

        RuleFor(transaction => transaction)
            .Must(validateType).WithMessage("Tipo de transação nao compativel com o tipo de categoria selecionado.");

        RuleFor(transaction => transaction.CategoryId)
            .GreaterThan(0).WithMessage("Categoria inválida.");
        
        RuleFor(transaction => transaction.UserId)
            .GreaterThan(0).WithMessage("Usuário inválido.");
            
        RuleFor(transaction => transaction)
        .Must(validateAge).WithMessage("Um menor de idade nao pode ter transações do tipo Receita.");
    }

    private bool validateType(Transaction transaction)
    {
        if (transaction.Category == null)
            return false;

        bool result;
        result = (transaction.Type == TransactionType.Income &&
                  (transaction.Category.Finality == FinalityType.Income || transaction.Category.Finality == FinalityType.Both))
                 ||
                 (transaction.Type == TransactionType.Expense &&
                  (transaction.Category.Finality == FinalityType.Expense || transaction.Category.Finality == FinalityType.Both));
        return result;
    }

    private bool validateAge(Transaction transaction)
    {
        if (transaction.User == null)
            return false;

        bool result;
        result = !(transaction.User.Age < 18 && transaction.Type == TransactionType.Income);
        return result;
    }
} 
