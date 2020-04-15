import { Client, TravelMode, TransitMode, RouteLeg}  from "@googlemaps/google-maps-services-js";

const DESTINATION = "Angel Station, Islington High St, The Angel, London N1 8XX, United Kingdom";

const parseDirectionsResponse = (routeLeg: RouteLeg) => {
  let time_walking = 0;
  let time_on_transit = 0;
  let tube_lines: string[] = [];
  const duration = routeLeg.duration.text;
  // TODO num stops? lots more info in the response
  routeLeg.steps.forEach((step: any) => {
    if(step.travel_mode == "WALKING") {
      time_walking += parseInt(step.duration.text.split(" ")[0])
    }
    if(step.travel_mode == "TRANSIT") {
      time_on_transit += parseInt(step.duration.text.split(" ")[0]);
      const line = step.transit_details.line.short_name;
      tube_lines.push(line);
    }
  });
  
  return {duration: duration, lines: tube_lines, walk_mins: time_walking};
}

export const getCommuteInfo = (origin: string) => {
  
  const client = new Client({});

  return client
    .directions({
      params: {
        alternatives:true,
        departure_time: "now",
        mode: TravelMode.transit,
        transit_mode: [TransitMode.rail],
        origin: origin,
        destination: DESTINATION,
        key: "" //process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000 // milliseconds
    })
    .then((r: any) => {
      const route: RouteLeg = r.data.routes[0].legs[0];
      const info = parseDirectionsResponse(route);
      const info_string = `${info.lines.join(" + ")} = ${info.duration} (${info.walk_mins}min walk)`;
      return info_string;
    })
    .catch((e: any) => {
      console.log(e);
    });
}
