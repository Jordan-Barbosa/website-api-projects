import mongoose from 'mongoose';

export interface ProjectAttrs {
  name: string;
  desc: string;
  url: string;
  github: string;
  technology: string[];
  isHeroku: boolean;
}

export interface ProjectDoc extends mongoose.Document {
  name: string;
  desc: string;
  url: string;
  github: string;
  technology: string[];
  isHeroku: boolean;
}

export interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
}

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
    technology: {
      type: [String],
      ref: 'Technology',
      required: true,
    },
    isHeroku: {
      type: Boolean,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

projectSchema.static('build', function (attrs: ProjectAttrs): ProjectDoc {
  return new Project(attrs);
});

const Project = mongoose.model<ProjectDoc, ProjectModel>('Project', projectSchema);

export { Project };
