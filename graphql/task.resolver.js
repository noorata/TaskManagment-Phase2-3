import "dotenv/config";
import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import User from "../models/UserModel.js";
import TaskModel from "../models/TaskModel.js";
import userResolvers from "../graphql/user.resolvers.js";
const UserMutation = userResolvers.Mutation;
import dayjs from 'dayjs';

const ObjectId = mongoose.Types.ObjectId;

const statusMap = {
  InProgress: "In Progress",
  OnHold: "On Hold",
  Pending: "Pending",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

const resolvers = {
  Query: {

getSortedTasks: async (_, __, { user }) => {
  if (!user) {
    console.log("❌ Unauthorized access");
    throw new Error("Unauthorized");
  }

  let filterConditions = {};

  if (user.role === "student") {
    filterConditions.assignedTo = user.id;
    console.log("👨‍🎓 طالب - إحضار المهام المعينة له، assignedTo =", user.id);
  } else if (user.role === "admin" || user.role === "teacher") {
    filterConditions.createdBy = user.id;
    console.log("🧑‍🏫 أدمن/معلم - إحضار المهام التي أنشأها، createdBy =", user.id);
  } else {
    console.log("❌ دور غير معروف:", user.role);
    throw new Error("Unauthorized role");
  }

  console.log("🧾 شروط الفلترة:", JSON.stringify(filterConditions));

  const tasks = await TaskModel.find(filterConditions)
    .populate('assignedTo', '_id UserName')
    .populate('createdBy', '_id UserName')
   .populate('project','_id title')

    .exec();console.log(tasks);

const formattedTasks = tasks.map(task => {
  const taskObj = task.toObject();

  return {
    ...taskObj,
    assignedTo: {
      id: task.assignedTo._id.toString(),
      UserName: task.assignedTo.UserName || "Unknown",
    },
    createdBy: {
      id: task.createdBy?._id?.toString() || null,
      UserName: task.createdBy?.UserName || "Unknown",
    },
    project: task.project
      ? {
          _id: task.project._id.toString(),  // هنا حولنا _id إلى id
          title: task.project.title,
        }
      : null,

    dueDate: dayjs(task.dueDate).format('D/M/YYYY'),
  };
});


  return formattedTasks;
},


taskCount: async (_, __, { user }) => {
  if (!user) throw new Error("Unauthorized");

  let filter = {};

  if (user.role === "admin") {
    filter.createdBy = user.id;
  } else if (user.role === "student") {
    filter.assignedTo = user.id;
  } else {
    throw new Error("Invalid user role");
  }

  const count = await TaskModel.countDocuments(filter);
  return count;
}


  },

  Mutation: {
    addTask: async (_, { input }, { user, models }) => {
  const { projecttitle, description, taskname, assignedTo, status, dueDate } = input;

  const assignedUser = await User.findOne({ UserName: assignedTo });
  if (!assignedUser) throw new Error("User not found");

  const project = await Project.findOne({ title: projecttitle});
  if (!project) throw new Error("Project not found");

  console.log(assignedUser);

  const isStudentInProject = project.students.some(
    (studentId) => String(studentId) === String(assignedUser._id)
  );

  if (user.role === "admin") {
    if (String(project.createdBy) !== String(user.id)) {
      throw new Error("You are not authorized to manage this project");
    }
    if (!isStudentInProject) {
      throw new Error("Assigned user is not part of this project group");
    }
  } 
  else if (user.role === "student") {
    if (String(user.id) !== String(assignedUser._id)) {
      throw new Error("You can only assign tasks to yourself");
    }
    // if (!isStudentInProject) {
    //   throw new Error("You are not part of this project group");
    // }
  } else {
    throw new Error("Unauthorized user role");
  }

  const due = new Date(dueDate);
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  if (due < start || due > end) {

   throw new Error("Due date must be within the project duration");
  }

  // ✅ لو الطالب أضاف التاسك لنفسه، خليه هو نفسه الـ createdBy
  const createdById =
    user.role === "student" && String(user._id) === String(assignedUser._id)
      ? assignedUser._id
      : user.id;

  const task = new TaskModel({
    projecttitle,
    description,
    taskname,
    assignedTo: assignedUser._id,
    project: project._id,
    status,
    dueDate,
    createdBy: createdById,
  });

  await task.save();

  const populatedTask = await TaskModel.findById(task._id)
    .populate("assignedTo", "UserName")
    .populate("project", "title")
    .populate("createdBy", "UserName");
console.log(populatedTask);
  return populatedTask;
},
updateTask: async (_, { id, input }) => {
  if (input.assignedTo) {
    const assignedUser = await User.findOne({ UserName: input.assignedTo });
    if (!assignedUser) {
      throw new Error("Assigned user not found");
    }
    input.assignedTo = assignedUser._id;
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(id, input, { new: true }).populate('assignedTo');
  if (!updatedTask) {
    throw new Error('Task not found');
  }

  if (!updatedTask.assignedTo) {
    throw new Error('Assigned user not found or deleted');
  }

  return {
    ...updatedTask.toObject(),
    assignedTo: {
      ...updatedTask.assignedTo.toObject(),
      _id: updatedTask.assignedTo._id.toString(),
      id: updatedTask.assignedTo._id.toString(),  // إذا الـschema يتوقع id وليس _id
    },
  };
},

deleteTask: async (_, { id }) => {
  const deletedTask = await TaskModel.findByIdAndDelete(id);
  if (!deletedTask) {
    throw new Error("Task not found or already deleted");
  }
  return {
    success: true,
    message: "Task deleted successfully",
    taskId: deletedTask._id.toString(),
  };
},
deleteTask: async (_, { id }) => {
  const deletedTask = await TaskModel.findByIdAndDelete(id);
  if (!deletedTask) {
    throw new Error("Task not found or already deleted");
  }
  return {
    success: true,
    message: "Task deleted successfully",
    taskId: deletedTask._id.toString(),
  };
},


  },
};
export default  resolvers;