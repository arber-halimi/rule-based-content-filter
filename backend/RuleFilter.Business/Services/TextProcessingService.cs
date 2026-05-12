using RuleFilter.DataAccess;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RuleFilter.Business.Results;
using RuleFilter.Entities;
using RuleFilter.Entities.Enums;
using System.Text.RegularExpressions;


namespace RuleFilter.Business.Services
{
    public class TextProcessingService
    {
        private readonly AppDbContext _context;

        public TextProcessingService(AppDbContext context)
        {
            _context = context;
        }

 
    }
}
