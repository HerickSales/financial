using AutoMapper;
using Data.Dtos;
using Domain.Entities;
using Domain.Enums;

namespace Data.Profiles;

public class CategoryProfile: Profile
{
    public CategoryProfile()
    {
        CreateMap<CreateCategoryDto, Category>().ForMember(
            dest => dest.Finality,
            opt => opt.MapFrom(src => MapFinalityType(src.Finality))
        );
        CreateMap<UpdateCategoryDto, Category>().ForMember(
            dest => dest.Finality,
            opt => opt.MapFrom(src => MapFinalityType(src.Finality))
        );
        CreateMap<Category, ReadCategoryDto>().ForMember(
            dest => dest.Finality,
            opt => opt.MapFrom(src => MapFinalityType(src.Finality))
        );
        CreateMap<Category, ReadCategorySimpleDto>().ForMember(
            dest => dest.Finality,
            opt => opt.MapFrom(src => MapFinalityType(src.Finality))
        );
    }
    private FinalityType MapFinalityType(string finality)
    {
        return finality.ToLower() switch
        {
            "income" => FinalityType.Income,
            "expense" => FinalityType.Expense,
            "both" => FinalityType.Both,
            _ => throw new ArgumentException("Invalid finality type")
        };
    }
    private string MapFinalityType(FinalityType finalityType)
    {
        return finalityType switch
        {
            FinalityType.Income => "income",
            FinalityType.Expense => "expense",
            FinalityType.Both => "both",
            _ => throw new ArgumentException("Invalid finality type")
        };
    }
}
