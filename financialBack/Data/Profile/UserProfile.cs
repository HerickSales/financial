using AutoMapper;
using Data.Dtos;
using Domain.Entities;

namespace Data.Profiles;

public class UserProfile: Profile
{
    public UserProfile()
    {
        CreateMap<CreateUserDto, User>();
        CreateMap<UpdateUserDto, User>();
        CreateMap<User, ReadUserDto>();
        CreateMap<User, ReadUserSimpleDto>();
    }
}
