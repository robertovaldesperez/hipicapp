﻿using Hipicapp.Controllers.Abstract;
using Hipicapp.Filters;
using Hipicapp.Model.Exceptions;
using Hipicapp.Model.File;
using Hipicapp.Model.Participant;
using Hipicapp.Proxy.Participant;
using Hipicapp.Utils.Pager;
using Hipicapp.Utils.Util;
using Spring.Context.Attributes;
using Spring.Objects.Factory.Attributes;
using Spring.Objects.Factory.Support;
using Spring.Stereotype;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Hipicapp.Controllers.Participant
{
    [Scope(ObjectScope.Request)]
    [Controller]
    [System.Web.Http.RoutePrefix("api/athletes")]
    public class AthleteController : HipicappApiController
    {
        [Autowired]
        public IAthleteProxy AthleteProxy { get; set; }

        [System.Web.Http.AcceptVerbs("POST")]
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/athletes/find")]
        //[Authorize(Roles = "ATHLETE")]
        public Page<Athlete> Find(AthleteFindRequest request)
        {
            return this.AthleteProxy.Paginated(request);
        }

        [System.Web.Http.AcceptVerbs("GET")]
        [System.Web.Http.HttpGet]
        [Route("api/athletes/get")]
        public Athlete Get(long? id)
        {
            return this.AthleteProxy.Get(id);
        }

        [System.Web.Http.AcceptVerbs("GET")]
        [System.Web.Http.HttpGet]
        [Route("api/athletes/getByCurrentUser")]
        public Athlete GetByCurrentUser()
        {
            return this.AthleteProxy.GetByCurrentUser();
        }

        [System.Web.Http.AcceptVerbs("POST")]
        [System.Web.Http.HttpPost]
        public Athlete Save([Valid] Athlete athlete)
        {
            return this.AthleteProxy.Save(athlete);
        }

        [System.Web.Http.AcceptVerbs("PUT")]
        [System.Web.Http.HttpPut]
        public Athlete Update([Valid] Athlete athlete)
        {
            return this.AthleteProxy.Update(athlete);
        }

        [System.Web.Http.AcceptVerbs("DELETE")]
        [System.Web.Http.HttpDelete]
        public Athlete Delete(Athlete athlete)
        {
            return this.AthleteProxy.Delete(athlete);
        }

        [System.Web.Http.AcceptVerbs("POST")]
        [System.Web.Http.HttpPost]
        public EnrollmentId Inscription(EnrollmentId id)
        {
            return this.AthleteProxy.Inscription(id);
        }

        [System.Web.Http.AcceptVerbs("POST")]
        [System.Web.Http.HttpPost]
        public async Task<FileInfo> Upload(long? id, HttpRequestMessage request)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = new MultipartMemoryStreamProvider();
            await request.Content.ReadAsMultipartAsync(provider);
            foreach (var file in provider.Contents)
            {
                FileInfo fileInfo = new FileInfo();
                fileInfo.FileName = file.Headers.ContentDisposition.FileName.Replace("\"", "");
                fileInfo.ContentType = file.Headers.ContentType.MediaType;
                fileInfo.Contents = await file.ReadAsByteArrayAsync();
                if (!ValidationUtils.IsValidImageMimeType(fileInfo.ContentType)
                        || !ValidationUtils.IsValidFileSize(fileInfo.Contents.LongLength))
                {
                    throw new ImageException();
                }
                return this.AthleteProxy.Upload(id, fileInfo);
            }

            return null;
        }
    }
}