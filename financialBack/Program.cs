using Microsoft.EntityFrameworkCore;
using financial.Data.Context;
using Data.UnitOfWork;
using Domain.Repository;
using Service;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Garante que o diretório do banco de dados existe
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "db");
Directory.CreateDirectory(dbPath);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseLazyLoadingProxies());
//automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
//injecao de dependencia de servicos
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<TransactionService>();


builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var app = builder.Build();

// Garante que o banco de dados seja criado
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("DefaultCors");

// Mapear os controllers
app.MapControllers();

app.Run();

