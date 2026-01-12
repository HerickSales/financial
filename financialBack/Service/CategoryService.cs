using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Repository;
using Domain.Validators;
using financial.Handlers;
using FluentResults;

namespace Service
{
    public class CategoryService
    {
        IMapper mapper;
        IUnitOfWork unit;

        CategoryValidator validator = new CategoryValidator();

        public CategoryService(IMapper mapper, IUnitOfWork unit)
        {
            this.mapper = mapper;
            this.unit = unit;
        }


        public async Task<Result> CreateCategory(CreateCategoryDto dto)
        {
            var category = mapper.Map<Category>(dto);
            var validationResult = validator.Validate(category);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return HandleResponse.FailResponse("Falha na validação da categoria", 400, errors);
            }
             unit.CategoryRepository.Add(category);
             await unit.Commit();
            return HandleResponse.SuccessResponse("Categoria criada com sucesso", 201, new {id = category.Id});
        }
        
        public async Task<Result> GetCategoryById(int id)
        {
            var category = await unit.CategoryRepository.FindById(id);
            if (category == null)
            {
                return HandleResponse.FailResponse("Categoria não encontrada", 404);
            }
            var categoryDto = mapper.Map<ReadCategoryDto>(category);
            return HandleResponse.SuccessResponse("Categoria encontrada com sucesso", 200, categoryDto);
        }
       
        public async Task<Result> GetAllCategories(int pageNumber, int pageSize, int finality)
        {
            System.Linq.Expressions.Expression<Func<Category, bool>> filter = c =>
              finality <= -1 || (int)c.Finality == finality;

            var categories = await unit.CategoryRepository.FindWhere(filter, pageNumber, pageSize);
            var categoryDtos = mapper.Map<List<ReadCategoryDto>>(categories);
            return HandleResponse.SuccessResponse("Categorias encontradas com sucesso", 200, categoryDtos);
        }

        public async Task<Result> DeleteCategory(int id)
        {
            var category = await unit.CategoryRepository.FindById(id);
            if (category == null)
            {
                return HandleResponse.FailResponse("Categoria não encontrada", 404);
            }
            unit.CategoryRepository.Delete(category);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Categoria deletada com sucesso", 204);
        }
        
        public async Task<Result> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            var category = await unit.CategoryRepository.FindById(id);
            if (category == null)
            {
                return HandleResponse.FailResponse("Categoria não encontrada", 404);
            }
            mapper.Map(dto, category);
            var validationResult = validator.Validate(category);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage).ToList();
                return HandleResponse.FailResponse("Falha na validação da categoria", 400, errors);
            }
                 
            unit.CategoryRepository.Update(category);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Categoria atualizada com sucesso", 204);
        }
        

    }
}