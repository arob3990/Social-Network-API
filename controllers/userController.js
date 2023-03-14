const { User, Thought } = require('../models/');

module.exports = {
    getUsers(req,res) {
        User.find()
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((dbUserData) => 
            !dbUserData
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(dbUserData)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((dbUserData) =>
            !dbUserData
            ? res.status(404).json({ message: 'No user with this id!' })
            : res.json(dbUserData)
            )
            .catch((err) => { 
                console.log(err);
                res.status(500).json(err);
            });
    }, 

    deleteUser(req, res) {
        User.findOneAndRemove({_id: req.params.userId })
            .then((dbUserData) =>
            ! dbUserData
                ? res.status(404).json({ message: 'No user found with this id!' })
                : Thought.deleteMany({ _id: {$in: dbUserData.thoughts }}
                    )
            )
            .then(() => {
                res.json({ message: "User and their associated thoughts deleted!"});
            })
            .catch((err) => 
                res.status(500).json(err)
            );
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        )
        .then((dbUserData) =>
            !dbUserData
                ? res.status(404).json({ message: 'No user with this id!'})
                : res.json(dbUserData)
            )
        .catch((err) => res.status(500). json(err));

    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        )
        .then((dbUserData) =>
            !dbUserData
                ? res.status(404).json({ message: 'No user with this id!'})
                : res.json(dbUserData)
            )
        .catch((err) => res.status(500). json(err));
    },

};
