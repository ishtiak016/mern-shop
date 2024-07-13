const User = require("../models/userModel"); // Importing the User model
const data = require("../data"); // Importing the predefined user data

// Function to delete all users
async function deleteAllUsers() {
  try {
    const result = await User.deleteMany({});
    console.log("Deleted all users successfully");
    return result;
  } catch (error) {
    console.error("Error deleting users:", error);
    throw error; // Re-throwing the error to handle it further up
  }
}



// Function to insert all users from data
async function insertAllUsers(usersData) {
  try {
    const users = await User.insertMany(usersData);
    console.log("Inserted all users successfully");
    return users;
  } catch (error) {
    console.error("Error inserting users:", error);
    throw error; // Re-throwing the error to handle it further up
  }
}

// Function to seed users
const seedUsers = async (req, res, next) => {
  try {
    // Delete all existing users
    await deleteAllUsers();

    // Insert all users from data
    const insertedUsers = await insertAllUsers(data.users);

    // Respond with inserted users
    res.status(201).json(insertedUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
    next(error); // Forwarding the error to the error handler middleware
  }
};

module.exports = seedUsers;

