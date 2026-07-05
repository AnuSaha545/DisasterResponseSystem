function DashboardSummary({ requests, resources }) {

  const stats = [
    {
      title: "Active",
      value: requests.filter(r => r.status !== "resolved").length,
      color: "#DC2626",
      icon: "🚨"
    },
    {
      title: "Available",
      value: resources.filter(r => r.status === "available").length,
      color: "#16A34A",
      icon: "🚑"
    },
    {
      title: "Waiting",
      value: requests.filter(r => r.status === "waiting_for_resource").length,
      color: "#F59E0B",
      icon: "⏳"
    },
    {
      title: "Resolved",
      value: requests.filter(r => r.status === "resolved").length,
      color: "#2563EB",
      icon: "✅"
    }
  ];

  return (

    <div className="row g-4 mb-4">

      {stats.map((stat) => (

        <div
          key={stat.title}
          className="col-lg-3 col-md-6"
        >

          <div
            className="p-4 rounded-4 shadow"
            style={{
              background: "#fff",
              borderLeft: `6px solid ${stat.color}`
            }}
          >

            <div
              className="d-flex justify-content-between"
            >

              <div>

                <small
                  className="text-muted"
                >
                  {stat.title}
                </small>

                <h2
                  className="fw-bold mt-2"
                >
                  {stat.value}
                </h2>

              </div>

              <div
                style={{
                  fontSize: "2rem"
                }}
              >
                {stat.icon}
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default DashboardSummary;