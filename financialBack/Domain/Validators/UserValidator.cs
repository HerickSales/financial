using FluentValidation;
using Domain.Entities;

namespace Domain.Validators;

public class UserValidator: AbstractValidator<User>
{
    /// <summary>
    /// Construtor que define as regras de validação para a entidade User.
    /// </summary>
    public UserValidator()
    {
        RuleFor(user => user.Name)
            .NotEmpty().WithMessage("Campo Nome é obrigatório.")
            .MinimumLength(2).WithMessage("O Nome deve ter no mínimo 2 caracteres.")
            .MaximumLength(100).WithMessage("O Nome deve ter no máximo 100 caracteres");
        RuleFor(user => user.Age)
            .InclusiveBetween(0, 150).WithMessage("A Idade deve estar entre 0 e 150 anos .");
    }
}
