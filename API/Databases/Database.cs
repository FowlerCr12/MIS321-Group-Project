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
#region UserDatabaseFunctions
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

        public async Task InsertUser(User myUser) // inserts a new user into the database
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
#endregion

        // CLASSES DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------
#region ClassesDatabaseFunctions

        private async Task<List<Class>> SelectClasses(string sql, List<MySqlParameter> parms) // gets all of the classes from the database.
        {
            List<Class> allClasses = new(); // makes a list of classes
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
                allClasses.Add(new Class() // adds the class to the list
                {
                    classID = reader.GetInt32(0),
                    classTime = reader.IsDBNull(1) ? null : reader.GetTimeSpan(1),
                    classDate = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    classType = reader.IsDBNull(3) ? null : reader.GetString(3),
                    className = reader.IsDBNull(4) ? null : reader.GetString(4),
                    classCapacity = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                    classAllowedPetTypes = reader.IsDBNull(6) ? null : reader.GetString(6)
                });
            }

            return allClasses;
        }

        private async Task ClassesNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Class> allClasses = new(); // makes list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Class>> GetAllClasses() // gets all of the shops from the database
        {
            string sql = "SELECT * FROM class where deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectClasses(sql, parms);

        }

        public async Task<List<Class>> GetClass(int id)
        {
            string sql = $"SELECT * FROM class WHERE classID = @id"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            return await SelectClasses(sql, parms);
        }

        public async Task InsertClass(Class myClass) // inserts a new shop into the database
        {
            string sql = "INSERT INTO class (classTime, classDate, classType, className, classCapacity) VALUES (@classTime, @classDate, @classType, @className, @classCapacity)"; // the SQL query that is used to insert the information into the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@classTime", myClass.classTime) { Value = myClass.classTime }); // adds the classTime to the list of parameters
            parms.Add(new MySqlParameter("@classDate", myClass.classDate) { Value = myClass.classDate }); // adds the classDate to the list of parameters
            parms.Add(new MySqlParameter("@classType", myClass.classType) { Value = myClass.classType }); // adds the classType to the list of parameters
            parms.Add(new MySqlParameter("@className", myClass.className) { Value = myClass.className }); // adds the className to the list of parameters
            parms.Add(new MySqlParameter("@classCapacity", myClass.classCapacity) { Value = myClass.classCapacity }); // adds the classCapacity to the list of parameters
            //parms.Add(new MySqlParameter("@userEmail", myClass.userEmail) { Value = myClass.userEmail }); // adds the userEmail to the list of parameters
            //parms.Add(new MySqlParameter("@userName", myClass.userName) { Value = myClass.userName }); // adds the userName to the list of parameters
            //parms.Add(new MySqlParameter("@userPassword", myClass.userPassword) { Value = myClass.userPassword }); // adds the userPassword to the list of parameters
            //parms.Add(new MySqlParameter("@userPayment", myClass.userPayment) { Value = myClass.userPayment }); // adds the userPayment to the list of parameters
            await ClassesNoReturnSql(sql, parms); // calls the UsersNoReturnSQL function to insert the user into the database
        }

        public async Task DeleteClass(int id) // deletes a shop from the database
        {
            string sql = "UPDATE class SET deleted = 'Y' WHERE id = @id"; // the SQL query that is used to delete the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await ClassesNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to delete the shop from the database
        }

        public async Task UpdateClass(Class myClass, int id) // updates a shop in the database
        {
            string sql = "UPDATE class SET userEmail = @userEmail, userName = @userName, userPassword = @userPassword, userPayment = @userPayment WHERE id = @id"; // the SQL query that is used to update the information in the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            //parms.Add(new MySqlParameter("@userEmail", myUser.userEmail) { Value = myUser.userEmail }); // adds the userEmail to the list of parameters
            //parms.Add(new MySqlParameter("@userName", myUser.userName) { Value = myUser.userName }); // adds the userName to the list of parameters
            //parms.Add(new MySqlParameter("@userPassword", myUser.userPassword) { Value = myUser.userPassword }); // adds the userPassword to the list of parameters
            //parms.Add(new MySqlParameter("@userPayment", myUser.userPayment) { Value = myUser.userPayment }); // adds the userPayment to the list of parameters
            //parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await ClassesNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to update the shop in the database
        }
    
#endregion
            // ADMIN DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------
#region AdminDatabaseFunctions
            private async Task<List<Admin>> SelectAdmins(string sql, List<MySqlParameter> parms) // gets all of the classes from the database.
        {
            List<Admin> allAdmins = new(); // makes a list of admins
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
                allAdmins.Add(new Admin() // adds the admin to the list
                {
                    adminID = reader.GetInt32(0),
                    adminEmail = reader.IsDBNull(1) ? null : reader.GetString(1),
                    adminPassword = reader.IsDBNull(2) ? null : reader.GetString(2),
                    adminName = reader.IsDBNull(3) ? null : reader.GetString(3),
                });
            }
            return allAdmins;
        }

        private async Task AdminsNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Admin> allAdmins = new(); // makes list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Admin>> GetAllAdmins() // gets all admins from the database
        {
            Console.WriteLine("Getting all admins");
            string sql = "SELECT * FROM admin WHERE deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectAdmins(sql, parms);

        }

        public async Task<List<Admin>> GetAdmin(int id)
        {
            string sql = $"SELECT * FROM admin WHERE adminID = @id"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            return await SelectAdmins(sql, parms);
        }

        public async Task InsertAdmin(Admin myAdmin) // inserts a new user into the database
        {
            string sql = "INSERT INTO admin (adminEmail, adminName, adminPassword, deleted) VALUES (@adminEmail, @adminName, @adminPassword, 'N')"; // the SQL query that is used to insert the information into the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@adminEmail", myAdmin.adminEmail) { Value = myAdmin.adminEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@adminName", myAdmin.adminName) { Value = myAdmin.adminName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@adminPassword", myAdmin.adminPassword) { Value = myAdmin.adminPassword }); // adds the userPassword to the list of parameters
            await AdminsNoReturnSql(sql, parms); // calls the UsersNoReturnSQL function to insert the user into the database
        }

        public async Task DeleteAdmin(int id) // deletes a shop from the database
        {
            string sql = "UPDATE admin SET deleted = 'Y' WHERE adminID = @id"; // the SQL query that is used to delete the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await AdminsNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to delete the shop from the database
        }

         public async Task UpdateAdmin(Admin myAdmin, int id) // updates a shop in the database
        {
            string sql = "UPDATE admin SET adminEmail = @adminEmail, adminName = @adminName, adminPassword = @adminPassword WHERE adminID = @id"; // the SQL query that is used to update the information in the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@adminEmail", myAdmin.adminEmail) { Value = myAdmin.adminEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@adminName", myAdmin.adminName) { Value = myAdmin.adminName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@adminPassword", myAdmin.adminPassword) { Value = myAdmin.adminPassword }); // adds the userPassword to the list of parameters
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await AdminsNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to update the shop in the database
        }
#endregion

#region TrainerDatabaseFunctions
        // TRAINER DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------

        private async Task<List<Trainer>> SelectTrainers(string sql, List<MySqlParameter> parms) // gets all of the classes from the database.
        {
            List<Trainer> allTeaches = new(); // makes a list of Teaches
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
                allTeaches.Add(new Trainer() // adds the admin to the list
                {
                    trainerID = reader.GetInt32(0),
                    trainerEmail = reader.IsDBNull(1) ? null : reader.GetString(1),
                    trainerPassword = reader.IsDBNull(2) ? null : reader.GetString(2),
                    trainerName = reader.IsDBNull(3) ? null : reader.GetString(3),
                });
            }

            return allTeaches;
        }

        private async Task TrainersNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Trainer> allTeaches = new(); // makes list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Trainer>> GetAllTrainers() // gets all of the shops from the database
        {
            string sql = "SELECT * FROM trainer where deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectTrainers(sql, parms);

        }

        public async Task<List<Trainer>> GetTrainer(int id)
        {
            string sql = $"SELECT * FROM trainer WHERE trainerID = @id"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            return await SelectTrainers(sql, parms);
        }

        public async Task InsertTrainer(Trainer myTrainer) // inserts a new user into the database
        {
            string sql = "INSERT INTO trainer (trainerEmail, trainerName, trainerPassword) VALUES (@trainerEmail, @trainerName, @trainerPassword)"; // the SQL query that is used to insert the information into the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@trainerEmail", myTrainer.trainerEmail) { Value = myTrainer.trainerEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@trainerName", myTrainer.trainerName) { Value = myTrainer.trainerName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@trainerPassword", myTrainer.trainerPassword) { Value = myTrainer.trainerPassword }); // adds the userPassword to the list of parameters
            await TrainersNoReturnSql(sql, parms); // calls the UsersNoReturnSQL function to insert the user into the database
        }

        public async Task DeleteTrainer(int id) // deletes a shop from the database
        {
            string sql = "UPDATE trainer SET deleted = 'Y' WHERE id = @id"; // the SQL query that is used to delete the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await TrainersNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to delete the shop from the database
        }

        public async Task UpdateTrainer(Trainer myTrainer, int id) // updates a shop in the database
        {
            string sql = "UPDATE trainer SET trainerEmail = @trainerEmail, trainerName = @trainerName, trainerPassword = @trainerPassword"; // the SQL query that is used to update the information in the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@trainerEmail", myTrainer.trainerEmail) { Value = myTrainer.trainerEmail }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@trainerName", myTrainer.trainerName) { Value = myTrainer.trainerName }); // adds the userName to the list of parameters
            parms.Add(new MySqlParameter("@trainerPassword", myTrainer.trainerPassword) { Value = myTrainer.trainerPassword }); // adds the userPassword to the list of parameters
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await TrainersNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to update the shop in the database
        }
        #endregion
        
        
        
        
        
        
        
        
        
        //TEACHES DATABASE FUNCTIONS BELOW THIS LINE ----------------------------------------------------------------------------------------------
        #region TeachesDatabaseFunctions
        private async Task<List<Teaches>> SelectTeaches(string sql, List<MySqlParameter> parms) // gets all of the classes from the database.
        {
            List<Teaches> allTeaches = new(); // makes a list of Teaches
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
                allTeaches.Add(new Teaches() // adds the admin to the list
                {
                    trainerID = reader.GetInt32(0),
                    classID = reader.GetInt32(1)
                });
            }

            return allTeaches;
        }

        private async Task TeachesNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Trainer> allTeaches = new(); // makes list of shops
            using var connection = new MySqlConnection(cs); // makes a new connection to the databse based on the "cs" string
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) // adds the parameters from the other functions if there are any
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Teaches>> GetAllTeaches() // gets all of the shops from the database
        {
            string sql = "SELECT * FROM teaches where deleted != 'Y'"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            return await SelectTeaches(sql, parms);

        }

        public async Task<List<Teaches>> GetTeaches(int id)
        {
            string sql = $"SELECT * FROM teaches WHERE trainerID = @id"; // the SQL query that is used to get the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            return await SelectTeaches(sql, parms);
        }

        public async Task InsertTeaches(Teaches myTeaches) // inserts a new user into the database
        {
            string sql = "INSERT INTO teaches (trainerID, classID) VALUES (@trainerEmail, @trainerID, @classID)"; // the SQL query that is used to insert the information into the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@trainerID", myTeaches.trainerID) { Value = myTeaches.trainerID }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@classID", myTeaches.classID) { Value = myTeaches.classID }); // adds the userName to the list of parameters
            await TeachesNoReturnSql(sql, parms); // calls the UsersNoReturnSQL function to insert the user into the database
        }

        public async Task DeleteTeaches(int id) // deletes a shop from the database
        {
            string sql = "UPDATE teaches SET deleted = 'Y' WHERE id = @id"; // the SQL query that is used to delete the information from the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@id", id) { Value = id }); // adds the id to the list of parameters
            await TeachesNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to delete the shop from the database
        }

        public async Task UpdateTeaches(Teaches myTeaches, int id) // updates a shop in the database
        {
            string sql = "UPDATE teaches SET trainerID = @trainerID, classID = @classID"; // the SQL query that is used to update the information in the database
            List<MySqlParameter> parms = new(); // makes the list of parameters that need to be added to the function
            parms.Add(new MySqlParameter("@trainerID", myTeaches.trainerID) { Value = myTeaches.trainerID }); // adds the userEmail to the list of parameters
            parms.Add(new MySqlParameter("@classID", myTeaches.classID) { Value = myTeaches.classID }); // adds the userName to the list of parameters
            await TeachesNoReturnSql(sql, parms); // calls the UsersNoReturnSql function to update the shop in the database
        }
        #endregion

    }
}
