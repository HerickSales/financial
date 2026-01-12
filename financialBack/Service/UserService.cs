using System.Reflection.Metadata;
using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Repository;
using Domain.Validators;
using financial.Handlers;
using FluentResults;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Service
{
    public class UserService
    {
        IMapper mapper;
        IUnitOfWork unit;

        UserValidator validator = new UserValidator();

        public UserService(IMapper mapper, IUnitOfWork unit)
        {
            this.mapper = mapper;
            this.unit = unit;
        }


        public async Task<Result> CreateUser(CreateUserDto dto)
        {
            var user = mapper.Map<User>(dto);
            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return HandleResponse.FailResponse("Falha na validação do usuario", 400, errors);
            }
             unit.UserRepository.Add(user);
             await unit.Commit();
            return HandleResponse.SuccessResponse("Usuario criado com sucesso", 201, new  {id = user.Id});
        }
        
        public async Task<Result> GetUserById(int id)
        {
            var user = await unit.UserRepository.FindById(id);
            if (user == null)
            {
                return HandleResponse.FailResponse("Usuario não encontrado", 404);
            }
            var userDto = mapper.Map<ReadUserDto>(user);
            return HandleResponse.SuccessResponse("Usuario encontrado com sucesso", 200, userDto);
        }
       
        public async Task<Result> GetAllUsers(int pageNumber, int pageSize, string name, int maxAge, int minAge)
        {
            System.Linq.Expressions.Expression<Func<User, bool>> filter = u =>
                (string.IsNullOrEmpty(name) || u.Name.Contains(name)) &&
                (maxAge <= -1 || u.Age <= maxAge) &&
                (minAge <= -1 || u.Age >= minAge);

            var users = await unit.UserRepository.FindWhere(filter, pageNumber, pageSize);
            var userDtos = mapper.Map<List<ReadUserDto>>(users);
            return HandleResponse.SuccessResponse("Usuarios encontrados com sucesso", 200, userDtos);
        }

        public async Task<Result> DeleteUser(int id)
        {
            var user = await unit.UserRepository.FindById(id);
            if (user == null)
            {
                return HandleResponse.FailResponse("Usuario não encontrado", 404);
            }
            unit.UserRepository.Delete(user);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Usuario deletado com sucesso", 204);
        }
        
        public async Task<Result> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await unit.UserRepository.FindById(id);
            if (user == null)
            {
                return HandleResponse.FailResponse("Usuario não encontrado", 404);
            }
            mapper.Map(dto, user);
            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return HandleResponse.FailResponse("Falha na validação do usuario", 400, errors);
            }
            unit.UserRepository.Update(user);
            await unit.Commit();
            return HandleResponse.SuccessResponse("Usuario atualizado com sucesso", 204);
        }
        

    }
}