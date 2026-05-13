using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RuleFilter.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRuleColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MatchType",
                table: "Rules",
                newName: "RuleMatchType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RuleMatchType",
                table: "Rules",
                newName: "MatchType");
        }
    }
}
