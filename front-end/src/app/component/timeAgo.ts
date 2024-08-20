import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

let timeAgoInstance: TimeAgo | null = null;

// Function to get a TimeAgo instance
export function getTimeAgo() {
  if (!timeAgoInstance) {
    TimeAgo.addDefaultLocale(en);
    timeAgoInstance = new TimeAgo('en-US');
  }
  return timeAgoInstance;
}