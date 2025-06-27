import axios from "axios";

export default defineComponent({
  async run({ event }) {
    const url = event.query.url;
    if (!url) throw new Error("Missing ?url parameter");

    const res = await axios.get(url);
    const rawHtml = res.data;

    if (!rawHtml || typeof rawHtml !== "string") {
      throw new Error("Expected HTML string but got: " + typeof rawHtml);
    }

    return {
      html: rawHtml  // ✅ MUST be named at top level
    };
  }
}); 