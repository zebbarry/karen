export default function actionCallback(assignments, meta, details) {
  assignments.forEach((assignment) => {
    console.log(
      `${assignment.person} is assigned to ${
        assignment.chore
      } (${JSON.stringify(details[assignment.person])}): ${meta.message}`
    );
  });
}
