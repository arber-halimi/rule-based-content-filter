using Microsoft.EntityFrameworkCore;
using RuleFilter.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace RuleFilter.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }
        public DbSet<Rule> Rules => Set<Rule>();
    }
}
