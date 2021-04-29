import { Publisher, ProjectCreatedEvent, Subjects } from '@jordanjordanb-portfolio/common';

export class ProjectCreatedPublisher extends Publisher<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated;
}
