import Project from '../models/projectModel.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const resolvers = {
  Query: {
 myProjectsCount: async (_, __, context) => {
  try {
    const currentUser = context.user;
    if (!currentUser) {
      throw new Error("غير مصرح لك بالدخول");
    }

    let filter = {};

    if (currentUser.role === "admin") {
      filter.createdBy = currentUser.id;
    } else if (currentUser.role === "student") {
      filter.students = currentUser.id;
    } else {
      throw new Error("الدور غير معروف");
    }

    const count = await Project.countDocuments(filter);
    return count;
    
  } catch (error) {
    throw new Error(`حدث خطأ: ${error.message}`);
  }
}
,

 completedProjectsCount: async (_, __, { user }) => {
  if (!user) throw new Error("Not authenticated");
console.log(user);
  if (user.role === "student") {
    const count = await Project.countDocuments({
      status: "Completed",
     students: user.id
,
    });
    return count;
  }

  const count = await Project.countDocuments({
    
createdBy: user.id,
    status: "Completed",
  });

  return count;
}
,

    myProjects: async (_, { status, search }, { user }) => {
  if (!user) throw new Error("Unauthorized");

  let filter = {};

  if (user.role === "admin") {
    filter.createdBy = user.id;
  } else if (user.role === "student") {
    filter.students = user.id;
  } else {
    throw new Error("Invalid role");
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const projects = await Project.find(filter)
    .populate("students", "_id UserName")
    .populate("createdBy", "_id UserName");

  return projects;
}

  },

  Mutation: {
    addProject: async (_, { input }, context) => {
      try {
        const currentUser = context.user;
        if (!currentUser || currentUser.role !== 'admin') {
          throw new Error('غير مصرح لك بإضافة مشروع');
        }

        const {
          title,
          description,
          students,
          category,
          startDate,
          endDate,
          status
        } = input;

        const studentUsers = await User.find({
          UserName: { $in: students },
          role: 'student'
        });

        if (studentUsers.length !== students.length) {
          throw new Error('بعض أسماء الطلاب غير موجودة أو غير صالحة');
        }

        const studentIds = studentUsers.map(u => u._id);

        const newProject = new Project({
          title,
          description,
          students: studentIds,
          category,
          startDate,
          endDate,
          status,
          createdBy: currentUser.id
        });

        await newProject.save();

        const populatedProject = await Project.findById(newProject._id)
          .populate('students', 'UserName universityId')
          .populate('createdBy', 'UserName');

        return populatedProject;

      } catch (error) {
        throw new Error(`فشل في إضافة المشروع: ${error.message}`);
      }
    }
  }
};

export default resolvers;
