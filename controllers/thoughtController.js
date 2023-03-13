const { Thought, User } = require('../models')

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((dbThoughtData) => 
                ! dbThoughtData
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(dbThoughtData)
                )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                return userController.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: dbThought}},
                    { new: true }
                );
            })
            .then((dbUserData) => 
            ! dbUserData
                ? res.status(404).json({
                    message: 'Thought created, but found no user with that ID'
                })
                : res.json('Created the Thought 🎉')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => 
                !dbThoughtData
                    ? res.status(404).json({ message: 'No thought with this id!'})
                    : res.json(dbThoughtData)
                )
            .catch((err) => {
                console.log(err); 
                res.status(500).json(err);
            });
    
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((dbThoughtData) =>
                !dbThoughtData
                    ? res.status(404).json({ message: 'Noo thought with this id!'})
                    : User.findOneAndUpdate(
                        {thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId }},
                        { new: true }
                    )
                )
            .then((dbuserData) => {
                !dbUserData
                    ? res.status(404).json({ message: 'Thought deleted but no User associated with it'})
                    : res.json({ message: 'Thought successfully deleted' })

            })    
            .catch((err) => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }}, 
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                !dbThoughtData
                    ? res.status(404).json({ message: 'No Thought with this ID'})
                    : res.json(dbThoughtData)
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    deleteReaction(req, res) {
        Thought.findOneAndupdate(
            { _id: req.params.thoughtId },
            { $pull : {reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }

        )
            .then((dbThoughtData) => {
                !dbThoughtData
                    ? res.status(404).json({ message: 'No Thought with this ID'})
                    : res.json(dbThoughtData)
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },


};