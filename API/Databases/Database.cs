using System;
using MySqlConnector;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Databases
{
    public class Database
    {
        private string cs;

        public Database()
        {
            // Get database connection information from environment variables
            string server = Environment.GetEnvironmentVariable("DB_SERVER");
            string user = Environment.GetEnvironmentVariable("DB_USER");
            string database = Environment.GetEnvironmentVariable("DB_NAME");
            string port = Environment.GetEnvironmentVariable("DB_PORT");
            string password = Environment.GetEnvironmentVariable("DB_PASSWORD");
            cs = $"Server={server};User ID={user};Database={database};Port={port};Password={password}";
        }
#region UserDatabaseFunctions
        private async Task<List<User>> SelectUsers(string sql, List<MySqlParameter> parms) // gets all of the users from the database.
        {
            List<User> allUsers = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allUsers.Add(new User()
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

        private async Task UsersNoReturnSql(string sql, List<MySqlParameter> parms) // used for updates, inserts, deletes
        {
            List<User> allUsers = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<User>> GetUser(int id)
        {
            string sql = $"SELECT * FROM user WHERE userID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            return await SelectUsers(sql, parms);
        }

        public async Task InsertUser(User myUser) // inserts a new user into the database
        {
            string sql = "INSERT INTO user (userEmail, userName, userPassword, userPayment) VALUES (@userEmail, @userName, @userPassword, @userPayment)";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@userEmail", myUser.userEmail) { Value = myUser.userEmail });
            parms.Add(new MySqlParameter("@userName", myUser.userName) { Value = myUser.userName });
            parms.Add(new MySqlParameter("@userPassword", myUser.userPassword) { Value = myUser.userPassword });
            parms.Add(new MySqlParameter("@userPayment", myUser.userPayment) { Value = myUser.userPayment });
            await UsersNoReturnSql(sql, parms);
        }

        public async Task DeleteUser(int id) // deletes a user from the database
        {
            string sql = "UPDATE user SET deleted = 'Y' WHERE id = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await UsersNoReturnSql(sql, parms);
        }

        public async Task UpdateUser(User myUser, int id) // updates a shop in the database
        {
            string sql = "UPDATE user SET userEmail = @userEmail, userName = @userName, userPassword = @userPassword, userPayment = @userPayment WHERE id = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@userEmail", myUser.userEmail) { Value = myUser.userEmail });
            parms.Add(new MySqlParameter("@userName", myUser.userName) { Value = myUser.userName });
            parms.Add(new MySqlParameter("@userPassword", myUser.userPassword) { Value = myUser.userPassword });
            parms.Add(new MySqlParameter("@userPayment", myUser.userPayment) { Value = myUser.userPayment });
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await UsersNoReturnSql(sql, parms);
        }
        public async Task<List<User>> GetAllUsers()
        {
            string sql = "SELECT * FROM user where deleted != 'Y'"; 
            List<MySqlParameter> parms = new();
            return await SelectUsers(sql, parms);
        }
#endregion

        // CLASSES DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------
#region ClassesDatabaseFunctions

        private async Task<List<Class>> SelectClasses(string sql, List<MySqlParameter> parms)
        {
            List<Class> allClasses = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allClasses.Add(new Class() // adds the class to the list
                {
                    classID = reader.GetInt32(0),
                    classTime = reader.IsDBNull(1) ? null : reader.GetTimeSpan(1), // ternary operators to check if the value is null cause I had some errors thrown. Wasn't sure how this worked at first but it just is basically an if else stataement. 
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
            List<Class> allClasses = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Class>> GetAllClasses() // gets all of the classes from the database
        {
            string sql = "SELECT * FROM class where deleted != 'Y'";
            List<MySqlParameter> parms = new();
            return await SelectClasses(sql, parms);

        }

        public async Task<List<Class>> GetClass(int id) // gets a class from the database by the id of the class
        {
            string sql = $"SELECT * FROM class WHERE classID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            return await SelectClasses(sql, parms);
        }

        public async Task InsertClass(Class myClass)
        {
            string sql = "INSERT INTO class (classTime, classDate, classType, className, classCapacity, classAllowedPetTypes) VALUES (@classTime, @classDate, @classType, @className, @classCapacity, @classAllowedPetTypes)";
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@classTime", myClass.classTime) { Value = myClass.classTime }); 
            parms.Add(new MySqlParameter("@classDate", myClass.classDate) { Value = myClass.classDate }); 
            parms.Add(new MySqlParameter("@classType", myClass.classType) { Value = myClass.classType });
            parms.Add(new MySqlParameter("@className", myClass.className) { Value = myClass.className });
            parms.Add(new MySqlParameter("@classCapacity", myClass.classCapacity) { Value = myClass.classCapacity });
            parms.Add(new MySqlParameter("@classAllowedPetTypes", myClass.classAllowedPetTypes) { Value = myClass.classAllowedPetTypes });
            await ClassesNoReturnSql(sql, parms);
        }

        public async Task DeleteClass(int id) // deletes a class from the database
        {
            string sql = "UPDATE class SET deleted = 'Y' WHERE id = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await ClassesNoReturnSql(sql, parms);
        }

        public async Task UpdateClass(Class myClass, int id) // updates a class in the database
        {
            string sql = "UPDATE class SET className = @className, classType = @classType, classDate = @classDate, classTime = @classTime, classCapacity = @classCapacity WHERE classID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@className", myClass.className) { Value = myClass.className });
            parms.Add(new MySqlParameter("@classType", myClass.classType) { Value = myClass.classType });
            parms.Add(new MySqlParameter("@classDate", myClass.classDate) { Value = myClass.classDate });
            parms.Add(new MySqlParameter("@classTime", myClass.classTime) { Value = myClass.classTime });
            parms.Add(new MySqlParameter("@classCapacity", myClass.classCapacity) { Value = myClass.classCapacity });
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await ClassesNoReturnSql(sql, parms);
        }
    
#endregion
            // ADMIN DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------
#region AdminDatabaseFunctions
            private async Task<List<Admin>> SelectAdmins(string sql, List<MySqlParameter> parms) // gets all of the admins from the database.
        {
            List<Admin> allAdmins = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allAdmins.Add(new Admin() // adds the admin to the list
                {
                    adminID = reader.GetInt32(0),
                    adminEmail = reader.IsDBNull(1) ? null : reader.GetString(1), // ternary operators same as above comment about them.
                    adminPassword = reader.IsDBNull(2) ? null : reader.GetString(2),
                    adminName = reader.IsDBNull(3) ? null : reader.GetString(3),
                });
            }
            return allAdmins;
        }

        private async Task AdminsNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Admin> allAdmins = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Admin>> GetAllAdmins() // gets all admins from the database
        {
            string sql = "SELECT * FROM admin WHERE deleted != 'Y'";
            List<MySqlParameter> parms = new();
            return await SelectAdmins(sql, parms);

        }

        public async Task<List<Admin>> GetAdmin(int id) // gets an admin from the database by the id of the admin
        {
            string sql = $"SELECT * FROM admin WHERE adminID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            return await SelectAdmins(sql, parms);
        }

        public async Task InsertAdmin(Admin myAdmin) // inserts a new admin into the database
        {
            string sql = "INSERT INTO admin (adminEmail, adminName, adminPassword, deleted) VALUES (@adminEmail, @adminName, @adminPassword, 'N')";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@adminEmail", myAdmin.adminEmail) { Value = myAdmin.adminEmail });
            parms.Add(new MySqlParameter("@adminName", myAdmin.adminName) { Value = myAdmin.adminName });
            parms.Add(new MySqlParameter("@adminPassword", myAdmin.adminPassword) { Value = myAdmin.adminPassword });
            await AdminsNoReturnSql(sql, parms);
        }

        public async Task DeleteAdmin(int id) // deletes an admin from the database
        {
            string sql = "UPDATE admin SET deleted = 'Y' WHERE adminID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await AdminsNoReturnSql(sql, parms);
        }

        public async Task UpdateAdmin(Admin myAdmin, int id) // updates an admin in the database
        {
            string sql = "UPDATE admin SET adminEmail = @adminEmail, adminName = @adminName, adminPassword = @adminPassword WHERE adminID = @id";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@adminEmail", myAdmin.adminEmail) { Value = myAdmin.adminEmail });
            parms.Add(new MySqlParameter("@adminName", myAdmin.adminName) { Value = myAdmin.adminName });
            parms.Add(new MySqlParameter("@adminPassword", myAdmin.adminPassword) { Value = myAdmin.adminPassword });
            parms.Add(new MySqlParameter("@id", id) { Value = id });
            await AdminsNoReturnSql(sql, parms);
        }
#endregion

#region TrainerDatabaseFunctions
        // TRAINER DATABASE FUNCTIONS BELOW THIS LINE ------------------------------------------------------------------------------------------------------------------------------------

        private async Task<List<Trainer>> SelectTrainers(string sql, List<MySqlParameter> parms) // gets all of the trainers from the database.
        {
            List<Trainer> allTrainers = new();
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync(); 
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allTrainers.Add(new Trainer()
                {
                    trainerID = reader.GetInt32(0),
                    trainerEmail = reader.IsDBNull(1) ? null : reader.GetString(1), // ternary operators same as above comment about them.
                    trainerPassword = reader.IsDBNull(2) ? null : reader.GetString(2),
                    trainerName = reader.IsDBNull(3) ? null : reader.GetString(3),
                });
            }

            return allTrainers;
        }

        private async Task TrainersNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Trainer> allTrainers = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Trainer>> GetAllTrainers() // gets all of the trainers from the database
        {
            string sql = "SELECT * FROM trainer where deleted != 'Y'"; 
            List<MySqlParameter> parms = new(); 
            return await SelectTrainers(sql, parms);

        }

        public async Task<List<Trainer>> GetTrainer(int id) // gets a trainer from the database by the id of the trainer
        {
            string sql = $"SELECT * FROM trainer WHERE trainerID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            return await SelectTrainers(sql, parms);
        }

        public async Task InsertTrainer(Trainer myTrainer) // inserts a new trainer into the database
        {
            string sql = "INSERT INTO trainer (trainerEmail, trainerName, trainerPassword, trainerSpecialization) VALUES (@trainerEmail, @trainerName, @trainerPassword, @trainerSpecialization)"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@trainerEmail", myTrainer.trainerEmail) { Value = myTrainer.trainerEmail }); 
            parms.Add(new MySqlParameter("@trainerName", myTrainer.trainerName) { Value = myTrainer.trainerName }); 
            parms.Add(new MySqlParameter("@trainerPassword", myTrainer.trainerPassword) { Value = myTrainer.trainerPassword });
            parms.Add(new MySqlParameter("@trainerSpecialization", myTrainer.trainerSpecialization) { Value = myTrainer.trainerSpecialization });
            await TrainersNoReturnSql(sql, parms); 
        }

        public async Task DeleteTrainer(int id) // deletes a trainer from the database
        {
            string sql = "UPDATE trainer SET deleted = 'Y' WHERE id = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TrainersNoReturnSql(sql, parms); 
        }

        public async Task UpdateTrainer(Trainer myTrainer, int id) // updates a trainer in the database
        {
            string sql = "UPDATE trainer SET trainerEmail = @trainerEmail, trainerName = @trainerName, trainerPassword = @trainerPassword"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@trainerEmail", myTrainer.trainerEmail) { Value = myTrainer.trainerEmail }); 
            parms.Add(new MySqlParameter("@trainerName", myTrainer.trainerName) { Value = myTrainer.trainerName }); 
            parms.Add(new MySqlParameter("@trainerPassword", myTrainer.trainerPassword) { Value = myTrainer.trainerPassword }); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TrainersNoReturnSql(sql, parms); 
        }
        #endregion
        
        
        //TEACHES DATABASE FUNCTIONS BELOW THIS LINE ----------------------------------------------------------------------------------------------
        #region TeachesDatabaseFunctions
        private async Task<List<Teaches>> SelectTeaches(string sql, List<MySqlParameter> parms) // gets all of the "teaches" from the database.
        // Teaches is basically a relationship between a trainer and a class. 
        {
            List<Teaches> allTeaches = new();  
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync(); 
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allTeaches.Add(new Teaches() 
                {
                    trainerID = reader.GetInt32(0),
                    classID = reader.GetInt32(1)
                });
            }

            return allTeaches;
        }

        private async Task TeachesNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Trainer> allTeaches = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Teaches>> GetAllTeaches() // gets all of the "teaches" from the database
        {
            string sql = "SELECT * FROM teaches where deleted != 'Y'"; 
            List<MySqlParameter> parms = new(); 
            return await SelectTeaches(sql, parms);

        }

        public async Task<List<Teaches>> GetTeaches(int id) // gets a "teaches" from the database by the specific trainerID
        {
            string sql = $"SELECT * FROM teaches WHERE trainerID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            return await SelectTeaches(sql, parms);
        }

        public async Task InsertTeaches(Teaches myTeaches) // inserts a new "teaches" into the database
        {
            string sql = "INSERT INTO teaches (trainerID, classID) VALUES (@trainerID, @classID)"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@trainerID", myTeaches.trainerID) { Value = myTeaches.trainerID }); 
            parms.Add(new MySqlParameter("@classID", myTeaches.classID) { Value = myTeaches.classID }); 
            await TeachesNoReturnSql(sql, parms); 
        }

        public async Task DeleteTeaches(int id) // deletes a "teaches" from the database
        {
            string sql = "UPDATE teaches SET deleted = 'Y' WHERE id = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TeachesNoReturnSql(sql, parms); 
        }

        public async Task UpdateTeaches(Teaches myTeaches, int id) // updates a "teaches" in the database
        {
            string sql = "UPDATE teaches SET trainerID = @trainerID, classID = @classID"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@trainerID", myTeaches.trainerID) { Value = myTeaches.trainerID }); 
            parms.Add(new MySqlParameter("@classID", myTeaches.classID) { Value = myTeaches.classID }); 
            await TeachesNoReturnSql(sql, parms); 
        }
        #endregion



        //PET DATABASE FUNCTIONS BELOW THIS LINE ----------------------------------------------------------------------------------------------
        #region PetDatabaseFunctions
        private async Task<List<Pet>> SelectPet(string sql, List<MySqlParameter> parms) // gets all of the pets from the database.
        {
            List<Pet> allPets = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync(); 
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allPets.Add(new Pet() // adds the admin to the list
                {
                    petID = reader.GetInt32(0),
                    petName = reader.IsDBNull(1) ? null : reader.GetString(1), // ternary operators same as above comment about them.
                    petType = reader.IsDBNull(2) ? null : reader.GetString(2),
                    petAge = reader.GetInt32(3),
                    petWeight = reader.GetInt32(4),
                    petBreed = reader.IsDBNull(5) ? null : reader.GetString(5),
                    petMedConditions = reader.IsDBNull(6) ? null : reader.GetString(6),
                    userID = reader.GetInt32(7)
                });
            }

            return allPets;
        }

        private async Task PetNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Pet> allPets = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Pet>> GetAllPets() // gets all of the pets from the database
        {
            string sql = "SELECT * FROM pet where deleted != 'Y'"; 
            List<MySqlParameter> parms = new(); 
            return await SelectPet(sql, parms);

        }

        public async Task<List<Pet>> GetPet(int id) // gets a pet from the database by the specific petID
        {
            string sql = $"SELECT * FROM pet WHERE petID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            return await SelectPet(sql, parms);
        }

        public async Task InsertPet(Pet myPet) // inserts a new pet into the database
        {
            string sql = "INSERT INTO pet (petID, petName, petType, petAge, petWeight, petBreed, petMedConditions, userID) VALUES (@petID, @petName, @petType, @petAge, @petWeight, @petBreed, @petMedConditions, @userID)"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@petID", myPet.petID) { Value = myPet.petID }); 
            parms.Add(new MySqlParameter("@petName", myPet.petName) { Value = myPet.petName }); 
            parms.Add(new MySqlParameter("@petType", myPet.petType) { Value = myPet.petType }); 
            parms.Add(new MySqlParameter("@petAge", myPet.petAge) { Value = myPet.petAge }); 
            parms.Add(new MySqlParameter("@petWeight", myPet.petWeight) { Value = myPet.petWeight }); 
            parms.Add(new MySqlParameter("@petBreed", myPet.petBreed) { Value = myPet.petBreed }); 
            parms.Add(new MySqlParameter("@petMedConditions", myPet.petMedConditions) { Value = myPet.petMedConditions }); 
            parms.Add(new MySqlParameter("@userID", myPet.userID) { Value = myPet.userID }); 
            await PetNoReturnSql(sql, parms); 
        }

        public async Task DeletePet(int id) // deletes a pet from the database
        {
            string sql = "UPDATE pet SET deleted = 'Y' WHERE petID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await PetNoReturnSql(sql, parms); 
        }

        public async Task UpdatePet(Pet myPet, int id) // updates a pet in the database
        {
            string sql = "UPDATE pet SET petID = @petID, petName = @petName, petType = @petType, petAge = @petAge, petWeight = @petWeight, petBreed = @petBreed, petMedConditions = @petMedConditions, userID = @userID"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@petID", myPet.petID) { Value = myPet.petID }); 
            parms.Add(new MySqlParameter("@petName", myPet.petName) { Value = myPet.petName }); 
            parms.Add(new MySqlParameter("@petType", myPet.petType) { Value = myPet.petType }); 
            parms.Add(new MySqlParameter("@petAge", myPet.petAge) { Value = myPet.petAge }); 
            parms.Add(new MySqlParameter("@petWeight", myPet.petWeight) { Value = myPet.petWeight }); 
            parms.Add(new MySqlParameter("@petBreed", myPet.petBreed) { Value = myPet.petBreed }); 
            parms.Add(new MySqlParameter("@petMedConditions", myPet.petMedConditions) { Value = myPet.petMedConditions }); 
            parms.Add(new MySqlParameter("@userID", myPet.userID) { Value = myPet.userID }); 
            await PetNoReturnSql(sql, parms); 
        }
        #endregion



        //TRAINER REQUEST DATABASE FUNCTIONS BELOW THIS LINE ----------------------------------------------------------------------------------------------
        #region TrainerRequestDatabaseFunctions
        private async Task<List<TrainerRequest>> SelectTrainerRequest(string sql, List<MySqlParameter> parms) // gets all of the "Trainer Requests" from the database.
        {
            List<TrainerRequest> allTrainerRequests = new(); // creates list to hold all of the trainer requests in order to return them.
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync(); 
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();
            int colRequestID = reader.GetOrdinal("requestID");
            int colRequestStatus = reader.GetOrdinal("requestStatus");
            int colTrainerID = reader.GetOrdinal("trainerID");
            int colClassID = reader.GetOrdinal("classID");

            while (await reader.ReadAsync()) 
            {
                var request = new TrainerRequest
                {
                    requestID = reader.GetInt32(colRequestID),
                    requestStatus = reader.GetString(colRequestStatus),
                    trainerID = reader.GetInt32(colTrainerID),
                    classID = reader.GetInt32(colClassID)
                };

                allTrainerRequests.Add(request);
            }

            return allTrainerRequests;
        }

        private async Task TrainerRequestNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Pet> allPets = new();
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<TrainerRequest>> GetAllTrainerRequests() // gets all of the trainer request from the database
        {
            string sql = "SELECT * FROM trainerRequest where deleted != 'Y'"; 
            List<MySqlParameter> parms = new(); 
            return await SelectTrainerRequest(sql, parms);

        }

        public async Task<List<TrainerRequest>> GetTrainerRequest(int id) // gets a trainer request from the database by the specific requeast id 
        {
            string sql = $"SELECT * FROM trainerRequest WHERE requestID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            return await SelectTrainerRequest(sql, parms);
        }

        public async Task InsertTrainerRequest(TrainerRequest myTrainerRequest) // inserts a new trainer request into the database
        {
            string sql = "INSERT INTO trainerRequest (requestID, requestStatus, classID, trainerID) VALUES (@requestID, @requestStatus, @classID, @trainerID)"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@requestID", myTrainerRequest.requestID) { Value = myTrainerRequest.requestID }); 
            parms.Add(new MySqlParameter("@requestStatus", myTrainerRequest.requestStatus) { Value = myTrainerRequest.requestStatus }); 
            parms.Add(new MySqlParameter("@classID", myTrainerRequest.classID) { Value = myTrainerRequest.classID }); 
            parms.Add(new MySqlParameter("@trainerID", myTrainerRequest.trainerID) { Value = myTrainerRequest.trainerID }); 
            await TrainerRequestNoReturnSql(sql, parms); 
        }
    
        public async Task DeleteTrainerRequest(int id) // deletes a trainer request from the database (soft delete)
        {
            string sql = "UPDATE trainerRequest SET deleted = 'Y' WHERE requestID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TrainerRequestNoReturnSql(sql, parms); 
        }

        public async Task UpdateTrainerRequest(TrainerRequest myTrainerRequest, int id) // updates a trainer request information in the database
        {
            string sql = "UPDATE trainerRequest SET requestStatus = @requestStatus, classID = @classID, trainerID = @trainerID WHERE requestID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@requestStatus", myTrainerRequest.requestStatus) { Value = myTrainerRequest.requestStatus }); 
            parms.Add(new MySqlParameter("@classID", myTrainerRequest.classID) { Value = myTrainerRequest.classID }); 
            parms.Add(new MySqlParameter("@trainerID", myTrainerRequest.trainerID) { Value = myTrainerRequest.trainerID }); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TrainerRequestNoReturnSql(sql, parms); 
        }

       public async Task<List<TrainerRequest>> GetPendingTrainerRequestsAsync() // gets all of the pending trainer requests from the database
        {
            string sql = "SELECT requestID, requestStatus, trainerID, classID FROM trainerRequest WHERE requestStatus = 'Pending'";
            List<MySqlParameter> parms = new();
            return await SelectTrainerRequest(sql, parms);
        }

        public async Task<bool> ApproveTrainerRequestAsync(int id) // changes request status to "Approved" and also creates a new "Teaches" object to be inserted into the teaches table.
        {       
                
                List<TrainerRequest> requests = await GetTrainerRequest(id); // retrives the trainer request from the database 
                if (requests.Count == 0)
                {
                    Console.WriteLine($"Trainer request with ID {id} not found");
                    return false; // Request not found
                }
                
                TrainerRequest request = requests[0];
                
                string updateSql = "UPDATE trainerRequest SET requestStatus = 'Approved' WHERE requestID = @id"; // sets the request status to approved
                List<MySqlParameter> updateParms = new();
                updateParms.Add(new MySqlParameter("@id", id));
                await TrainerRequestNoReturnSql(updateSql, updateParms);
                
                Teaches teaches = new Teaches // builds new Teaches so that it can be inserted into the database. 
                {
                    trainerID = request.trainerID,
                    classID = request.classID
                };
                
                await InsertTeaches(teaches); // inserts the new teaches into the database using previous function
                
                return true;
        }
    
          public async Task<bool> DenyTrainerRequestAsync(int id) // changes request status to deny if denied
        {       
            string sql = "UPDATE trainerRequest SET requestStatus = 'Denied' WHERE requestID = @id";
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await TrainerRequestNoReturnSql(sql, parms);
            return true;
        }
        #endregion

        // ENROLLS DATABASE FUNCTIONS BELOW THIS LINE ----------------------------------------------------------------------------------------------
        #region EnrollsDatabaseFunctions
        private async Task<List<Enroll>> SelectEnroll(string sql, List<MySqlParameter> parms) // gets all of the enrolls from the database.
        {
            List<Enroll> allEnrolls = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                allEnrolls.Add(new Enroll() 
                {
                    enrollmentID = reader.GetInt32(0),
                    enrollmentTimeStatus = reader.GetString(1),
                    classID = reader.GetInt32(2),
                    userID = reader.GetInt32(3)
                });
            }

            return allEnrolls;
        }

        private async Task EnrollNoReturnSql(string sql, List<MySqlParameter> parms) // use for updates, inserts, deletes
        {
            List<Enroll> allEnrolls = new(); 
            using var connection = new MySqlConnection(cs); 
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null) 
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            await command.ExecuteNonQueryAsync();

        }

        public async Task<List<Enroll>> GetAllEnrolls() // gets all of the enrolls from the database
        {
            string sql = "SELECT * FROM enrolls WHERE deleted != 'Y'"; 
            List<MySqlParameter> parms = new(); 
            return await SelectEnroll(sql, parms);

        }

        public async Task<List<Enroll>> GetEnroll(int id) // gets an enroll from the database by the specific enrollmentID
        {
            string sql = $"SELECT * FROM enrolls WHERE enrollmentID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            return await SelectEnroll(sql, parms);
        }

        public async Task InsertEnroll(Enroll myEnroll) // inserts a new enroll into the database
        {
            string sql = "INSERT INTO enrolls (enrollmentID, classID, userID) VALUES (@enrollmentID, @classID, @userID)"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@enrollmentID", myEnroll.enrollmentID) { Value = myEnroll.enrollmentID }); 
            parms.Add(new MySqlParameter("@classID", myEnroll.classID) { Value = myEnroll.classID }); 
            parms.Add(new MySqlParameter("@userID", myEnroll.userID) { Value = myEnroll.userID }); 
            await EnrollNoReturnSql(sql, parms); 
        }

        public async Task DeleteEnroll(int id) // deletes a enroll from the database
        {
            string sql = "UPDATE enrolls SET deleted = 'Y' WHERE enrollmentID = @id"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@id", id) { Value = id }); 
            await EnrollNoReturnSql(sql, parms); 
        }

        public async Task UpdateEnroll(Enroll myEnroll, int id) // updates a enroll in the database
        {
            string sql = "UPDATE enrolls SET enrollmentID = @enrollmentID, classID = @classID, userID = @userID"; 
            List<MySqlParameter> parms = new(); 
            parms.Add(new MySqlParameter("@enrollmentID", myEnroll.enrollmentID) { Value = myEnroll.enrollmentID }); 
            parms.Add(new MySqlParameter("@classID", myEnroll.classID) { Value = myEnroll.classID }); 
            parms.Add(new MySqlParameter("@userID", myEnroll.userID) { Value = myEnroll.userID }); 
            await EnrollNoReturnSql(sql, parms); 
        }
        #endregion

        // ENROLLMENT COUNT METHODS
        #region EnrollmentCountMethods
        public async Task<Dictionary<int, int>> GetEnrollmentCountsByClass() // gets the number of enrollments for each class but is grouped by the classID
        {
            Dictionary<int, int> enrollmentCounts = new Dictionary<int, int>();
            
            string sql = "SELECT classID, COUNT(*) as enrollmentCount FROM enrolls WHERE deleted != 'Y' GROUP BY classID";
            List<MySqlParameter> parms = new();
            
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);
            
            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }
            
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                int classID = reader.GetInt32(0);
                int count = reader.GetInt32(1);
                enrollmentCounts[classID] = count;
            }
            
            return enrollmentCounts;
        }
        #endregion
    }
}
