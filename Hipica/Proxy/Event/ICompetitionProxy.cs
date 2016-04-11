﻿using Hipica.Model.Event;
using Hipica.Model.Participant;
using Hipica.Utils.Pager;
using System.Collections.Generic;

namespace Hipica.Proxy.Event
{
    public interface ICompetitionProxy
    {
        Page<Competition> Paginated(CompetitionFindRequest request);

        Competition Get(long? id);

        Competition Save(Competition competition);

        Competition Update(Competition competition);

        Competition Delete(Competition competition);

        IList<Score> SimulateScore(Competition competition);
    }
}