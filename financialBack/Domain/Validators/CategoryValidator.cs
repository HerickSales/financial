using FluentValidation;
using Domain.Entities;

namespace Domain.Validators;

public class CategoryValidator: AbstractValidator<Category>
{
    public CategoryValidator()
    {
      RuleFor(category => category.Description)
          .NotEmpty().WithMessage("Campo Descrição é obrigatório.")
          .MinimumLength(2).WithMessage("A Descrição deve ter no mínimo 2 caracteres.")
          .MaximumLength(100).WithMessage("A Descrição deve ter no máximo 100 caracteres.");
    }
}
