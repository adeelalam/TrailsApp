
var trails = '';
var bundle;


$(document).ready(function () {
    $('#path_detail').hide();
    $.ajax({
        type: 'GET',
        url: "https://forward-byte-711.appspot.com/read/Test/Development/en",
        dataType: 'json',
        async: false,
        success: function (response) {
            console.log(response);
            bundle = response;
            //console.log(bundle);
            $('#bundle_name').text(response.bundle_info);
            $('#bundle_info').text(response.bundle_more_info);

            $.each(response.paths, function (idx, trail) {
                if (trail.path_name && 0 !== trail.path_name.length) {
                    trails += '<a href="#" class="list-group-item path_btn" path_id="'+idx+'">' + trail.path_name + '</a>';
                }
            });
            $('.list-group').html(trails);
        }
    });

    //console.log(bundle);
    //initialize(1, bundle.paths[0]);

    $('.path_btn').on('click', function() {
        //  alert($(this).text()+$(this).attr('path_id'));
        initialize($(this).attr('path_id'), bundle.paths[$(this).attr('path_id')]);
        $('.path_btn').removeClass('active');
        $(this).addClass('active');
    });
$('.modal').on('show.bs.modal', function() {
    $('.modal_path_image').attr("src", $('#path_img').attr("src"));
});


});
function initialize(path_id, pathData) {
    //nsole.log(pathData);
    var path = [];
    $('#path_name').text(pathData.path_name);
    var pathInfo  = (pathData.path_info)?pathData.path_info:'this path has no info this is default info :)'
    $('#path_info').text(pathInfo);
    $('#path_length').text(pathData.path_length);
    $('#path_time').text(pathData.path_time);
    $('#path_img').attr("src", pathData.path_image);

    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var latLngBounds = new google.maps.LatLngBounds();
    var latlngobj;
    $.each(pathData.path_polyline[0], function (idx, cors) {
        latlngobj = new google.maps.LatLng(cors.lat, cors.lng);
        path.push(latlngobj);
        latLngBounds.extend(latlngobj);
        new google.maps.Marker({
            map: map,
            position: latlngobj,
            title: "Point " + (idx + 1)
        });
    });

    var polyline = new google.maps.Polyline({
        map: map,
        path: path,
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeWeight: 5
    });
    map.fitBounds(latLngBounds);

    $('#bundle_detail').hide();
    $('#path_detail').show();
}