using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Service;
using Data.Dtos;

namespace Controller;

[Route("[controller]")]
public class TransactionController : BaseController
{
    TransactionService _transactionService;
    public TransactionController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<ActionResult> GetTransactions(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int month = -1,
        [FromQuery] int year = -1
        )
    {
        if(month == -1)
        {
            month = DateTime.Now.Month;
        }

        if(year == -1)
        {
            year = DateTime.Now.Year;
        }

        var result = await _transactionService.GetTransactions(pageNumber, pageSize, month, year);
        return ToActionResult(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetTransactionById(int id)
    {
        var result = await _transactionService.GetTransactionById(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<ActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
    {
        var result = await _transactionService.CreateTransaction(dto);
        return ToActionResult(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionDto dto)
    {
        var result = await _transactionService.UpdateTransaction(id, dto);
        return ToActionResult(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTransaction(int id)
    {
        var result = await _transactionService.DeleteTransaction(id);
        return ToActionResult(result);
    }
}
