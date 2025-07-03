// In-memory database simulation
let users = [];
let currentId = 1;

class User {
    constructor(userData) {
        this.id = currentId++;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.email = userData.email;
        this.phone = userData.phone;
        this.pan = userData.pan;
        this.dateOfBirth = userData.dateOfBirth;
        this.address = userData.address;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Static methods for CRUD operations
    static getAll() {
        return users;
    }

    static getById(id) {
        return users.find(user => user.id === parseInt(id));
    }

    static getByEmail(email) {
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    static getByPan(pan) {
        return users.find(user => user.pan === pan);
    }

    static create(userData) {
        // Check if email already exists
        const existingUser = this.getByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Check if PAN already exists
        const existingPan = this.getByPan(userData.pan);
        if (existingPan) {
            throw new Error('User with this PAN already exists');
        }

        const user = new User(userData);
        users.push(user);
        return user;
    }

    static update(id, userData) {
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Check if email is being changed and if it already exists
        if (userData.email && userData.email !== users[userIndex].email) {
            const existingUser = this.getByEmail(userData.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
        }

        // Check if PAN is being changed and if it already exists
        if (userData.pan && userData.pan !== users[userIndex].pan) {
            const existingPan = this.getByPan(userData.pan);
            if (existingPan) {
                throw new Error('User with this PAN already exists');
            }
        }

        // Update user data
        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined) {
                users[userIndex][key] = userData[key];
            }
        });
        
        users[userIndex].updatedAt = new Date();
        return users[userIndex];
    }

    static delete(id) {
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        return deletedUser;
    }

    static createMany(usersData) {
        const createdUsers = [];
        const errors = [];

        usersData.forEach((userData, index) => {
            try {
                // Check for duplicates in the current batch
                const isDuplicateEmail = createdUsers.some(user => 
                    user.email.toLowerCase() === userData.email.toLowerCase()
                );
                const isDuplicatePan = createdUsers.some(user => 
                    user.pan === userData.pan
                );

                if (isDuplicateEmail) {
                    throw new Error(`Duplicate email in upload: ${userData.email}`);
                }
                if (isDuplicatePan) {
                    throw new Error(`Duplicate PAN in upload: ${userData.pan}`);
                }

                const user = this.create(userData);
                createdUsers.push(user);
            } catch (error) {
                errors.push({
                    row: index + 2, // +2 because Excel rows start from 1 and we skip header
                    email: userData.email,
                    error: error.message
                });
            }
        });

        return { createdUsers, errors };
    }

    static deleteAll() {
        users = [];
        currentId = 1;
    }

    static getStats() {
        return {
            totalUsers: users.length,
            recentUsers: users.filter(user => {
                const dayAgo = new Date();
                dayAgo.setDate(dayAgo.getDate() - 1);
                return user.createdAt > dayAgo;
            }).length
        };
    }
}

module.exports = User;
