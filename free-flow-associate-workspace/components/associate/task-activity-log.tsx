interface ActivityItem {
  type: "status" | "comment" | "created" | string;
  text: string;
  time: string;
}

interface TaskActivityLogProps {
  activities?: ActivityItem[];
}

export default function TaskActivityLog({ activities = [] }: TaskActivityLogProps) {
  const hasActivities = activities.length > 0;

  return (
    <div className="p-4 space-y-3 m-0">
      <h3 className="font-semibold text-foreground mb-4">Activity Log</h3>

      {hasActivities ? (
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-0">
              <div
                className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === "status"
                    ? "bg-blue-500"
                    : activity.type === "comment"
                    ? "bg-green-500"
                    : activity.type === "created"
                    ? "bg-muted-foreground"
                    : "bg-primary"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No activity yet</p>
        </div>
      )}
    </div>
  );
}
