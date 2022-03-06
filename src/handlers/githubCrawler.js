'use strict';

require("../config/database")
const JobModel = require("../models/job")
const axios = require("axios")
const cheerio = require("cheerio")

const extractJobs = (html, dateInitialExtract, dateFinalExtract) => {
    const jobs = [];
    const $ = cheerio.load(html)
    $(".js-navigation-item > *").toArray().forEach(item => {
        const title = $(item).find("a.Link--primary").text();
        const workMode = title.split(/\s/)[0].replace("[", "").replace("]", "")
        const link = "https://github.com" + $(item).find("a.Link--primary").attr("href");
        let company = title.split("@")[1]

        if (!company || company.length == 0) {
            company = title.split(" na ")[1]
        }
        let labels = []
        $(item).find(".labels > a ").toArray().forEach(label => {
            labels.push($(label).text().replace(/[\n]/g, "").trim())
        })
        let postedAt = $(item).find("relative-time").attr("datetime")
        postedAt = (new Date(postedAt))

        const isPostedToday = postedAt >= dateInitialExtract  && postedAt <= dateFinalExtract;
        if (title && isPostedToday) {
            jobs.push({
                title,
                workMode,
                company,
                link,
                technologies: labels,
                postedAt
            })
        }
    })
    return jobs
}

module.exports.getJobs = async (event) => {
    let response = await axios.get("https://github.com/backend-br/vagas/issues?q=is%3Aissue+is%3Aopen+")
    let html = response.data;
    const dateInitialExtract = new Date();
    dateInitialExtract.setUTCSeconds(0)
    dateInitialExtract.setUTCMinutes(0)
    dateInitialExtract.setUTCHours(0)

    const dateFinalExtract = new Date();
    dateFinalExtract.setUTCSeconds(59)
    dateFinalExtract.setUTCMinutes(59)
    dateFinalExtract.setUTCHours(23)
    let jobs = extractJobs(html, dateInitialExtract, dateFinalExtract)
    await JobModel.insertMany(jobs)
};
