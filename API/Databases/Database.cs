using System;
using MySqlConnector;
using API.Models;

namespace API.Databases
{
    public class Database
    {
        private string cs;

        public Database()
        {
            cs = "Server=lgg2gx1ha7yp2w0k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com;User ID=wnh64lk32rq36af5;Database=gfpku6ep7udf4m7m;Port=3306;Password=heinlafs5cyqs6wu";

        }

        private async Task<List<User>> SelectUsers(string sql, List<MySqlParameter> parms) // gets all of the shops from the database.
        {
            List<User> allUsers = new(); // makes a list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync(); // opens the connection to the database
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allUsers.Add(new User() // adds the shop to the list
                {
                    userID = reader.GetInt32(0),
                    userEmail = reader.IsDBNull(1) ? null : reader.GetString(1),
                    userName = reader.IsDBNull(2) ? null : reader.GetString(2),
                    userPassword = reader.IsDBNull(3) ? null : reader.GetString(3),
                    userPayment = reader.IsDBNull(4) ? null : reader.GetString(4)
                });
            }

            return allUsers;
        }

        private async Task UsersNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<User> allUsers = new(); // makes list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<User>> GetAllShops() // gets all of the shops from the database
        {
            string sql = "SELECT * FROM User where deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectUsers(sql, parms);

        }

        public async Task<List<User>> GetUser(int id)
        {
            string sql = $"SELECT * FROM user WHERE userID = @id"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            return await SelectUsers(sql, parms);
        }

        public async Task InsertShop(User myUser) // inserts a new shop into the database
        {
            string sql = "INSERT INTO user (userEmail, userName, userPassword, userPayment) VALUES (@userEmail, @userName, @userPassword, @userPayment)"; // the SQL query that is used to insert the information into the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@userEmail", myUser.userEmail) { Value = myUser.userEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@userName", myUser.userName) { Value = myUser.userName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@userPassword", myUser.userPassword) { Value = myUser.userPassword }); // adds the userPassword to the list of parameters
            parms.Add(new MySqlParameter("@userPayment", myUser.userPayment) { Value = myUser.userPayment }); // adds the userPayment to the list of parameters
            await UsersNoReturnSql(sql, parms); // calls the UsersNoReturnSQL function to insert the user into the database
        }

        public async Task DeleteUser(int id) // deletes a shop from the database
        {
            string sql = "UPDATE user SET deleted = 'Y' WHERE id = @id"; // the SQL query that is used to delete the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await UsersNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to delete the shop from the database
        }

        public async Task UpdateUser(User myUser, int id) // updates a shop in the database
        {
            string sql = "UPDATE user SET userEmail = @userEmail, userName = @userName, userPassword = @userPassword, userPayment = @userPayment WHERE id = @id"; // the SQL query that is used to update the information in the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@userEmail", myUser.userEmail) { Value = myUser.userEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@userName", myUser.userName) { Value = myUser.userName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@userPassword", myUser.userPassword) { Value = myUser.userPassword }); // adds the userPassword to the list of parameters
            parms.Add(new MySqlParameter("@userPayment", myUser.userPayment) { Value = myUser.userPayment }); // adds the userPayment to the list of parameters
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await UsersNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to update the shop in the database
        }
        //methods for users
        public async Task<List<User>> GetAllUsers()
        {
            string sql = "SELECT * FROM user where deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectUsers(sql, parms);
        }
    }
}
