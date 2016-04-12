﻿using Hipicapp.Model.Participant;
using System.Linq;

namespace Hipicapp.Service.Participant
{
    public class HorsePredicates
    {
        private HorsePredicates()
        {
        }

        public static IQueryable<Horse> ValueOf(HorseFindFilter filter, IQueryable<Horse> q)
        {
            var query = q;
            if (filter.AthleteId != null)
            {
                query = query.Where(x => x.AthleteId == filter.AthleteId);
            }
            if (filter.Name != null)
            {
                query = query.Where(x => x.Name == filter.Name);
            }
            return query;
        }
    }
}