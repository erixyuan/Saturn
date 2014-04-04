<?php
	$presenter = new Illuminate\Pagination\BootstrapPresenter($paginator);
?>

<?php if ($paginator->getLastPage() > 1): ?>
	<ul class="fn-clear g-pagination">
			<?php echo $presenter->render(); ?>
	</ul>
<?php endif; ?>